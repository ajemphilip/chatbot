import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'
import audioFile from '../speech.mp3'

function App() {
  const [messages, setMessages] = useState("")
  const [loading, setLoading] = useState(true)
  const [messagesPar, setMessagesPar] = useState([])
  const [lastResponse, setLastResponse] = useState("");

  useEffect(() => {
    if (lastResponse) {
      console.log("here");
    }
  }, [lastResponse])


  const playAudio = () => {
    setTimeout(()=>{ 
      let audio =  new Audio(audioFile)
      console.log(audio);
      audio.play()
      audio.onended = () => {
        setTimeout(()=>{ 
          setLoading(true) 
        },4000)
      
      }
    },5000)
  }
  const getFile = async (response) => {
    await axios.post('//localhost:5000/audio',
      {
        message: response
      })
      .then((response) => {
        playAudio()
      })
      .catch((error) => {
        console.log(error);
      })
  }

  const sendReq = async () => {

    setLoading(false)
    await axios.post('//localhost:5000/find-complexity', {
      message: messages
    },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        setMessages(messages + response.data)
        setMessagesPar([...messagesPar, response.data])
        setLastResponse(response.data)
        getFile(response.data)

      })
      .catch((error) => {
        console.log(error);
      })
  }

  let messagePars = messagesPar.map(datum => <p>{datum}</p>)


  return (
    <>
      {loading ? <button onClick={sendReq}>
        Send Request
      </button> : <h1>Loading</h1>}
      {messagePars}
    </>
  )
}

export default App
