"use client"
import { useSession, signIn } from "next-auth/react"
import AuthModal from "./AuthModal"
import { useState } from "react"

 function RegisterButton({text, style}) {
  const { data: session } = useSession()
  const [showModal, setShowModal] = useState(false)

  const handleClick = () => {
    if (!session) {
      setShowModal(true)
    } else {

      window.location.href = "/register"
    }
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={style}
      >
        {text}
      </button>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
    </>
  )
}

export default RegisterButton