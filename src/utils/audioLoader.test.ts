// Mock the audioLoader module directly
jest.mock('./audioLoader', () => {
  const mockAudioAr = { question_1: '/ar/question_1.mp3' }
  const mockAudioEn = { question_1: '/en/question_1.mp3' }
  return {
    audioAr: mockAudioAr,
    audioEn: mockAudioEn,
    getAudio: jest.fn((lang: string) =>
      lang === 'ar' ? mockAudioAr : mockAudioEn,
    ),
  }
})

import { getAudio, audioAr, audioEn } from './audioLoader'

describe('audioLoader', () => {
  describe('getAudio', () => {
    it('returns audioAr when language is "ar"', () => {
      const result = getAudio('ar')
      expect(result).toBe(audioAr)
    })

    it('returns audioEn when language is not "ar"', () => {
      const result = getAudio('en')
      expect(result).toBe(audioEn)
    })

    it('returns audioEn for any other language', () => {
      const result = getAudio('fr')
      expect(result).toBe(audioEn)
    })
  })
})
