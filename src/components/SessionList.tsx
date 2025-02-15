import { useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Search } from 'lucide-react'
import { motion } from 'framer-motion'

interface ChatSession {
  id: string
  title: string
}

export function SessionList({ sessions, onCreate, onSelect }: {
  sessions: ChatSession[]
  onCreate: () => void
  onSelect: (id: string) => void
}) {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <h3 className="font-semibold text-lg">Chat Sessions</h3>
        <Button size="sm" onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <div className="mb-4 relative">
          <Input
            placeholder="Search sessions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10"
          />
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="space-y-2">
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left font-normal"
                  onClick={() => onSelect(session.id)}
                >
                  {session.title}
                </Button>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
