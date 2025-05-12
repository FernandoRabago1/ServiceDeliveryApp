'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type CreatePostFormProps = {
  ownerUid: string
}

export default function CreatePostForm({ ownerUid }: CreatePostFormProps) {
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [cost, setCost] = useState<number | ''>('')

  const generateRandomLocationInMexico = () => {
    const lat = +(Math.random() * (32.7 - 14.5) + 14.5).toFixed(6)
    const lng = +(Math.random() * (-86.5 + 117) - 117).toFixed(6)
    return { latitude: lat, longitude: lng }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { latitude, longitude } = generateRandomLocationInMexico()

    const postData = {
      title,
      body,
      cost: Number(cost),
      owner_uid: ownerUid,
      latitude,
      longitude
    }

    try {
      const res = await fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      if (res.ok) {
        router.push('/posts')
      } else {
        const error = await res.json()
        alert(`Error: ${error.message || 'No se pudo crear el post'}`)
      }
    } catch (error) {
      console.error('Error de red:', error)
      alert('Error de red al conectar con el servidor.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Crear nuevo servicio</h2>

      <Input
        placeholder="Título del servicio"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Textarea
        placeholder="Descripción detallada del servicio"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />

      <Input
        type="number"
        placeholder="Costo en MXN"
        value={cost}
        onChange={(e) => setCost(Number(e.target.value))}
        required
      />

      <Button type="submit" className="w-full">Publicar</Button>
    </form>
  )
}
