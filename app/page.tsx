import CompanionCard from '@/components/CompanionCard'
import CompanionList from '@/components/CompanionList'
import Cta from '@/components/CTA'
import { Button } from '@/components/ui/button'
import { recentSessions } from '@/constants'
import { getAllCompanions, getRecentSessions } from '@/lib/actions/companion.action'
import { getSubjectColor } from '@/lib/utils'
import React from 'react'

const Page = async () => {
  const companions = await getAllCompanions({ limit : 3});
  const recentSessionCompanion = await getRecentSessions(10);




  return (
    <main>
      <h1>Popular Companions</h1>

      <section className='home-section'>
        {companions.map((companion) => (
            <CompanionCard
              key={companion.id}
              {...companion}
              color={getSubjectColor(companion.subject)}
            />
        ))}
        
        
      </section>

      <section className='home-section'>
        <CompanionList 
          title = "Recent completed session"
          companions={recentSessionCompanion}
          classNames="w-2/3 max-lg:w-full"
        />
        <Cta />
      </section>
    </main>
  )
}

export default Page