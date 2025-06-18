'use client';

import { cn, configureAssistant, getSubjectColor } from '@/lib/utils'
import { vapi } from '@/lib/vapi.sdk';
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';
import soundwaves from '@/constants/soundwaves.json'
import { addToSessionHistory } from '@/lib/actions/companion.action';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';


enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED',
}
interface Message {
  [x: string]: string;
  role: 'assistant' | 'user';
  content: string;
}

const CompanionComponent = ({ companionId, subject, topic, name, userName, style, voice, userImage} : CompanionComponentProps) => {
    

    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);

    const [isSpeaking, setIsSpeaking] = useState(false);

    const lottieRef = useRef<LottieRefCurrentProps>(null);

    const [isMuted, setIsMuted] = useState(false);

    const [messages, setmessages] =useState<SavedMessage[]>([]);

    useEffect(() => {
        if(lottieRef){
            if(isSpeaking) {
                lottieRef.current?.play()
            } else {
                lottieRef.current?.stop()
            }
        }
    }, [isSpeaking, lottieRef])
    
    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);

        const onCallEnd = () => {
            setCallStatus(CallStatus.FINISHED);
            addToSessionHistory(companionId)
        }
        const onMessage = (message: Message) => {
            if(message.type === 'transcript' && message.transcriptType === 'final'){
                const newMessage = {role: message.role, content: message.transcript}
                setmessages((prev: any) => [newMessage, ...prev])
            }
        }

        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onError = (error: Error) => console.log('Error',error);

        vapi.on('call-start',onCallStart);
        vapi.on('call-end',onCallEnd);
        vapi.on('message',onMessage);
        vapi.on('error',onError);
        vapi.on('speech-start',onSpeechStart);
        vapi.on('speech-end',onSpeechEnd);

        return () => {
            vapi.off('call-start',onCallStart);
            vapi.off('call-end',onCallEnd);
            vapi.off('message',onMessage);
            vapi.off('error',onError);
            vapi.off('speech-start',onSpeechStart);
            vapi.off('speech-end',onSpeechEnd);
        }
        
    }, []);

    const toggleMicrophone = () => {
        const isMuted = vapi.isMuted();
        vapi.setMuted(!isMuted);
        setIsMuted(!isMuted)
    }
    const handleCall = async() => {
        setCallStatus(CallStatus.CONNECTING)

        const assistantOverrides = {
            variableValues: {
                subject, topic, style
            },
            clientMessages: ['transcript'],
            serverMessages: [],
        }
        //@ts-expect-error
        vapi.start(configureAssistant(voice, style), assistantOverrides)
    }

    const handleDisconnect= () => {
        setCallStatus(CallStatus.FINISHED)
        vapi.stop()
    }

    return (
      <div className="h-screen p-6 flex" style={{ backgroundColor: "oklch(0.98 0.02 100)" }}>
        <div className="w-full h-full flex border border-black bg-white/20">
          {/* Left Side - Participants */}
          <div className="w-1/2 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-lg space-y-6">
              
              <div className="bg-white/50 border border-black p-6 flex flex-col items-center space-y-4" >
                            <div className="relative">
                              <div className="w-32 h-32 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: getSubjectColor(subject)}}>
                                {/* Static state */}
                                <div
                                  className={cn(
                                    "absolute transition-opacity duration-1000",
                                    callStatus === CallStatus.INACTIVE ? "opacity-100" : "opacity-0",
                                  )}
                                >
                                  <Image
                                    src={`/icons/${subject}.svg`}
                                    alt="subject"
                                    width={64}
                                    height={64}
                                    className="invert"
                                  />
                                </div>
              
                                {/* Connecting state */}
                                <div
                                  className={cn(
                                    "absolute transition-opacity duration-1000",
                                    callStatus === CallStatus.CONNECTING ? "opacity-100 animate-pulse" : "opacity-0",
                                  )}
                                >
                                  <Image
                                    src="images/sand-clock.svg?height=64&width=64"
                                    alt="Connecting..."
                                    width={64}
                                    height={64}
                                    className="invert"
                                  />
                                </div>
              
                                {/* Active state with Lottie animation */}
                                <div
                                  className={cn(
                                    "absolute transition-opacity duration-1000",
                                    callStatus === CallStatus.ACTIVE ? "opacity-100" : "opacity-0",
                                  )}
                                >
                                  {soundwaves && (
                                    <Lottie
                                      lottieRef={lottieRef}
                                      animationData={soundwaves}
                                      autoplay={false}
                                      loop={true}
                                      style={{ width: 80, height: 80 }}
                                    />
                                  )}
                                </div>
                              </div>
              
                              {/* Status indicator */}
                              <div
                                className={cn(
                                  "absolute -bottom-1 -right-1 w-5 h-5 border-2 border-white",
                                  callStatus === CallStatus.ACTIVE ? "bg-green-500" : "bg-black",
                                )}
                              ></div>
                            </div>

                <div className="text-center">
                  <h1 className="text-lg font-medium text-black/90 mb-1">{name}</h1>
                  <p className="text-black/50 text-sm">AI Tutor</p>
                  <div className="mt-2">
                    <span
                      className={cn(
                        "px-3 py-1 text-xs font-medium border",
                        callStatus === CallStatus.ACTIVE
                          ? "bg-green-100 text-green-700 border-green-200"
                          : callStatus === CallStatus.CONNECTING
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : "bg-black/5 text-black/50 border-black",
                      )}
                    >
                      {callStatus === CallStatus.ACTIVE
                        ? "Teaching"
                        : callStatus === CallStatus.CONNECTING
                          ? "Connecting..."
                          : "Ready to teach"}
                    </span>
                  </div>
                </div>
              </div>

              {/* User */}
              <div className="bg-white/50 border border-black p-6 flex flex-col items-center space-y-4">
                <div className="relative">
                  <Image
                    src={userImage || "icons/{subject}.svg"}
                    alt={userName}
                    width={128}
                    height={128}
                    className="border-2 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 border-2 border-white"></div>
                </div>

                <div className="text-center">
                  <h2 className="text-lg font-medium text-black/90 mb-1">{userName}</h2>
                  <p className="text-black/50 text-sm">Student</p>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={toggleMicrophone}
                    disabled={callStatus !== CallStatus.ACTIVE}
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-3 font-medium transition-all border-2",
                      isMuted
                        ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                        : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100",
                      callStatus !== CallStatus.ACTIVE && "opacity-40 cursor-not-allowed",
                    )}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isMuted ? "Unmute" : "Mute"}
                  </button>

                  <button
                    onClick={callStatus === CallStatus.ACTIVE ? handleDisconnect : handleCall}
                    className={cn(
                      "flex items-center justify-center gap-2 px-4 py-3 font-semibold text-white transition-all",
                      callStatus === CallStatus.ACTIVE
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-black hover:bg-black/90",
                      callStatus === CallStatus.CONNECTING && "animate-pulse",
                    )}
                  >
                    {callStatus === CallStatus.ACTIVE ? (
                      <><PhoneOff className="w-4 h-4" /> End Session</>
                    ) : callStatus === CallStatus.CONNECTING ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div> Connecting...</>
                    ) : (
                      <><Phone className="w-4 h-4" /> Start Session</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Transcription */}
          <div className="w-1/2 border-l border-black flex flex-col">
            <div className="p-4 border-b border-black bg-white/30">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-black/90">Live Transcription</h2>
                <div
                  className={cn(
                    "px-3 py-1 text-xs font-medium border",
                    callStatus === CallStatus.ACTIVE
                      ? "bg-green-100 text-green-700 border-green-200"
                      : callStatus === CallStatus.CONNECTING
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-black/5 text-black/50 border-black",
                  )}
                >
                  {callStatus === CallStatus.ACTIVE
                    ? "Recording"
                    : callStatus === CallStatus.CONNECTING
                      ? "Connecting..."
                      : "Ready"}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-white/20">
              {callStatus === CallStatus.INACTIVE ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center bg-white/50 border border-black/10 p-6">
                    <div className="w-12 h-12 mx-auto mb-3 bg-black/5 flex items-center justify-center">
                      <Mic className="w-6 h-6 text-black/30" />
                    </div>
                    <p className="text-black/40 text-sm">Start a session to see live transcription</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((entry, index) => (
                    <div key={index} className="bg-white/50 border border-black p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={cn(
                            "w-6 h-6 flex items-center justify-center text-xs font-medium border border-black",
                            entry.role === 'assistant' ? "bg-black text-white" : "bg-white text-black/70",
                          )}
                        >
                          {entry.role === 'assistant' ? "T" : "Y"}
                        </div>
                        <span className="text-sm font-medium text-black/70">
                          {(entry.role === 'assistant' ? name : userName).split(" ")[0]}
                        </span>
                        <span className="text-xs text-black/40 bg-black/5 px-2 py-1 border border-black">
                          {entry.timestamp}
                        </span>
                      </div>
                      <div className="ml-8">
                        <p className="text-black/80 leading-relaxed text-sm">{entry.content}</p>
                      </div>
                    </div>
                  ))}

                  {callStatus === CallStatus.ACTIVE && (
                    <div className="bg-white/50 border border-black p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-red-500 flex items-center justify-center border border-black">
                          <div className="w-2 h-2 bg-white animate-pulse"></div>
                        </div>
                        <span className="text-sm text-black/60">Listening...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-black bg-white/30">
              <div className="flex items-center justify-between text-sm text-black/50">
                <span className="text-xs">Session transcript will be saved automatically</span>
                {callStatus === CallStatus.ACTIVE && (
                  <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-2 py-1">
                    <div className="w-2 h-2 bg-red-500 animate-pulse"></div>
                    <span className="text-red-700 text-xs font-medium">Live</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};



export default CompanionComponent
