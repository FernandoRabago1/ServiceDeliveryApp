// app/auth/register/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RegisterPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<"client"|"provider">("client")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [ine, setIne] = useState("")
  const [curp, setCurp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Regex que acepta exactamente 18 caracteres alfanuméricos
  const regexIne  = /^[A-Z0-9]{18}$/i
  const regexCurp = /^[A-Z0-9]{18}$/i

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (userType === "provider") {
      if (!regexIne.test(ine) && !regexCurp.test(curp)) {
        setError("Para ofertar servicios, debes ingresar un INE o CURP válido de 18 caracteres")
        return
      }
    }

    setLoading(true)
    try {
      await axios.post(
        `http://localhost:3000/api/auth/register`,
        {
          name,
          email,
          password,
          role: "member",
          is_worker: userType === "provider"
        },
        { withCredentials: true }
      )
      router.push("/auth/login")
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Join QuickServ</CardDescription>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label>I want to:</Label>
              <RadioGroup
                defaultValue="client"
                onValueChange={v => setUserType(v as any)}
                className="flex gap-4"
              >
                <div>
                  <RadioGroupItem value="client" id="client" />
                  <Label htmlFor="client">Hire Services</Label>
                </div>
                <div>
                  <RadioGroupItem value="provider" id="provider" />
                  <Label htmlFor="provider">Offer Services</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            { (
              <Tabs defaultValue="ine">
                <TabsList className="grid w-full grid-cols-2 gap-2 mb-2">
                  <TabsTrigger value="ine">INE</TabsTrigger>
                  <TabsTrigger value="curp">CURP</TabsTrigger>
                </TabsList>
                <TabsContent value="ine">
                  <div>
                    <Label htmlFor="ine">INE Number</Label>
                    <Input
                      id="ine"
                      placeholder="18 caracteres"
                      value={ine}
                      onChange={e => setIne(e.target.value)}
                      maxLength={18}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="curp">
                  <div>
                    <Label htmlFor="curp">CURP</Label>
                    <Input
                      id="curp"
                      placeholder="18 caracteres"
                      value={curp}
                      onChange={e => setCurp(e.target.value)}
                      maxLength={18}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating…" : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <Link href="/auth/login" className="text-blue-600">
            Already have an account? Login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
