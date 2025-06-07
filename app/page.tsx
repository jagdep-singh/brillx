import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/CompanionList'
import Cta from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import React from 'react'

const Page = () => {
  return (
    <main>
      <h1>Popular Companions</h1>

      <section className='home-section'>
        <CompanionCard
          id='123'
          name="Dora the Brainy Explorer"
          topic="Neural Network"
          subject="science"
          duration={45}
          color="#FFD65A"
        />
        <CompanionCard
          id='456'
          name="Number Wizard"
          topic="Integration"
          subject="maths"
          duration={30}
          color="#16C47F"
        />
        <CompanionCard
          id='789'
          name="Talkative Verba "
          topic="Language"
          subject="english litrature"
          duration={30}
          color="#FF9D23"
        />
      </section>

      <section className='home-section'>
        <CompanionList 
          title = "Recent completed session"
          companions={recentSessions}
          classNames="w-2/3 max-lg:w-full"
        />
        <Cta />
      </section>
    </main>
  )
}

export default Page