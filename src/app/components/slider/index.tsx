import React, { useState, useRef } from 'react'

export default function Slider({
  onChange,
  answerOptions,
}: {
  onChange: (value: string, score: number, questionId: string) => void
  answerOptions: {
    label: string
    value: string
    audio: string
  }[]
}) {
  const [index, setIndex] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleSelect = (i: number) => {
    setIndex(i)
    onChange(answerOptions[i].value, 0, 'skip')

    if (audioRef.current) {
      audioRef.current.src = answerOptions[i].audio
      audioRef.current.currentTime = 0
      audioRef.current.play()
    }
  }

  const percentage = (index / (answerOptions.length - 1)) * 100

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="relative w-4/5 h-6 bg-gray-200 rounded-full shrink-0">
        <div
          className="absolute top-0 left-0 h-full bg-yellow-200 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />

        <img
          src="/images/progress_indicator.png"
          alt="cat"
          className="absolute top-1/2 -translate-y-1/2 w-10 h-10 select-none pointer-events-none transition-all duration-300 z-10"
          style={{
            left: `${percentage}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />

        {answerOptions.map((_, i) => {
          const left = (i / (answerOptions.length - 1)) * 100
          const isActive = i === index

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className="absolute top-1/2 -translate-y-1/2 z-0"
              style={{ left: `${left}%` }}
            >
              <div
                className={`
                  rounded-full transition-all duration-200
                  ${isActive ? 'w-4 h-4 bg-red-500' : 'w-3 h-3 bg-red-400'}
                `}
              />
            </button>
          )
        })}
      </div>

      <div className="relative w-full flex mt-3">
        {answerOptions.map((option, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            className="flex-1 py-2 text-sm text-gray-700 hover:text-black"
          >
            {option.label}
          </button>
        ))}
      </div>

      <audio ref={audioRef} />
    </div>
  )
}
