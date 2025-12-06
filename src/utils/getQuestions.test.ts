import getQuestions from './getQuestions'

// Mock audioLoader
jest.mock('./audioLoader', () => ({
  getAudio: jest.fn((lang: string) => ({
    question_1: `/${lang}/question_1.mp3`,
    question_2: `/${lang}/question_2.mp3`,
    question_3: `/${lang}/question_3.mp3`,
    question_4: `/${lang}/question_4.mp3`,
    question_5: `/${lang}/question_5.mp3`,
    question_6: `/${lang}/question_6.mp3`,
    question_7: `/${lang}/question_7.mp3`,
    question_8: `/${lang}/question_8.mp3`,
    question_9: `/${lang}/question_9.mp3`,
    question_10: `/${lang}/question_10.mp3`,
    question_11: `/${lang}/question_11.mp3`,
    question_12: `/${lang}/question_12.mp3`,
    question_13: `/${lang}/question_13.mp3`,
    question_14: `/${lang}/question_14.mp3`,
    question_15: `/${lang}/question_15.mp3`,
    question_16: `/${lang}/question_16.mp3`,
    question_17: `/${lang}/question_17.mp3`,
    question_18: `/${lang}/question_18.mp3`,
    question_19: `/${lang}/question_19.mp3`,
    question_20: `/${lang}/question_20.mp3`,
    question_21: `/${lang}/question_21.mp3`,
    story_1: `/${lang}/story_1.mp3`,
    story_2: `/${lang}/story_2.mp3`,
    story_3: `/${lang}/story_3.mp3`,
    story_4: `/${lang}/story_4.mp3`,
    story_5: `/${lang}/story_5.mp3`,
    question_1_option_1: `/${lang}/question_1_option_1.mp3`,
    question_1_option_2: `/${lang}/question_1_option_2.mp3`,
    question_1_option_3: `/${lang}/question_1_option_3.mp3`,
    question_2_option_1: `/${lang}/question_2_option_1.mp3`,
    question_2_option_2: `/${lang}/question_2_option_2.mp3`,
    question_2_option_3: `/${lang}/question_2_option_3.mp3`,
    question_3_option_1: `/${lang}/question_3_option_1.mp3`,
    question_3_option_2: `/${lang}/question_3_option_2.mp3`,
    question_3_option_3: `/${lang}/question_3_option_3.mp3`,
    question_4_option_1: `/${lang}/question_4_option_1.mp3`,
    question_4_option_2: `/${lang}/question_4_option_2.mp3`,
    question_4_option_3: `/${lang}/question_4_option_3.mp3`,
    question_5_option_1: `/${lang}/question_5_option_1.mp3`,
    question_5_option_2: `/${lang}/question_5_option_2.mp3`,
    question_5_option_3: `/${lang}/question_5_option_3.mp3`,
    question_5_option_4: `/${lang}/question_5_option_4.mp3`,
    question_6_option_1: `/${lang}/question_6_option_1.mp3`,
    question_6_option_2: `/${lang}/question_6_option_2.mp3`,
    question_6_option_3: `/${lang}/question_6_option_3.mp3`,
    question_6_option_4: `/${lang}/question_6_option_4.mp3`,
    question_7_option_1: `/${lang}/question_7_option_1.mp3`,
    question_7_option_2: `/${lang}/question_7_option_2.mp3`,
    question_7_option_3: `/${lang}/question_7_option_3.mp3`,
    question_7_option_4: `/${lang}/question_7_option_4.mp3`,
    question_8_option_1: `/${lang}/question_8_option_1.mp3`,
    question_8_option_2: `/${lang}/question_8_option_2.mp3`,
    question_8_option_3: `/${lang}/question_8_option_3.mp3`,
    question_8_option_4: `/${lang}/question_8_option_4.mp3`,
    question_9_option_1: `/${lang}/question_9_option_1.mp3`,
    question_9_option_2: `/${lang}/question_9_option_2.mp3`,
    question_9_option_3: `/${lang}/question_9_option_3.mp3`,
    question_9_option_4: `/${lang}/question_9_option_4.mp3`,
    question_10_option_1: `/${lang}/question_10_option_1.mp3`,
    question_10_option_2: `/${lang}/question_10_option_2.mp3`,
    question_10_option_3: `/${lang}/question_10_option_3.mp3`,
    question_10_option_4: `/${lang}/question_10_option_4.mp3`,
    question_11_option_1: `/${lang}/question_11_option_1.mp3`,
    question_11_option_2: `/${lang}/question_11_option_2.mp3`,
    question_11_option_3: `/${lang}/question_11_option_3.mp3`,
    question_11_option_4: `/${lang}/question_11_option_4.mp3`,
    question_12_option_1: `/${lang}/question_12_option_1.mp3`,
    question_12_option_2: `/${lang}/question_12_option_2.mp3`,
    question_12_option_3: `/${lang}/question_12_option_3.mp3`,
    question_13_option_1: `/${lang}/question_13_option_1.mp3`,
    question_13_option_2: `/${lang}/question_13_option_2.mp3`,
    question_13_option_3: `/${lang}/question_13_option_3.mp3`,
    question_14_option_1: `/${lang}/question_14_option_1.mp3`,
    question_14_option_2: `/${lang}/question_14_option_2.mp3`,
    question_14_option_3: `/${lang}/question_14_option_3.mp3`,
    question_15_option_1: `/${lang}/question_15_option_1.mp3`,
    question_17_option_1: `/${lang}/question_17_option_1.mp3`,
    question_18_option_1: `/${lang}/question_18_option_1.mp3`,
    question_18_option_3: `/${lang}/question_18_option_3.mp3`,
    question_19_option_2: `/${lang}/question_19_option_2.mp3`,
    question_19_option_3: `/${lang}/question_19_option_3.mp3`,
    question_20_option_2: `/${lang}/question_20_option_2.mp3`,
    question_20_option_3: `/${lang}/question_20_option_3.mp3`,
    question_21_option_1: `/${lang}/question_21_option_1.mp3`,
    question_21_option_2: `/${lang}/question_21_option_2.mp3`,
    question_21_option_3: `/${lang}/question_21_option_3.mp3`,
    question_21_option_4: `/${lang}/question_21_option_4.mp3`,
    question_21_option_5: `/${lang}/question_21_option_5.mp3`,
    question_21_option_6: `/${lang}/question_21_option_6.mp3`,
    question_21_option_7: `/${lang}/question_21_option_7.mp3`,
  })),
}))

describe('getQuestions', () => {
  const mockT = jest.fn((key: string) => key)

  it('returns questions array with correct structure', () => {
    const questions = getQuestions(mockT, 'en')
    expect(Array.isArray(questions)).toBe(true)
    expect(questions.length).toBeGreaterThan(0)
  })

  it('includes question_1 with correct structure', () => {
    const questions = getQuestions(mockT, 'en')
    const q1 = questions.find((q) => q.questionId === 'question_1')
    expect(q1).toBeDefined()
    expect(q1?.question).toBe('assessment.questions.q1')
    expect(q1?.image).toBe('1.png')
    expect(q1?.answerOptions).toHaveLength(3)
  })

  it('includes slider type question', () => {
    const questions = getQuestions(mockT, 'en')
    const sliderQ = questions.find((q) => q.type === 'slider')
    expect(sliderQ).toBeDefined()
    expect(sliderQ?.questionId).toBe('question_4')
  })

  it('includes story type questions', () => {
    const questions = getQuestions(mockT, 'en')
    const storyQs = questions.filter((q) => q.type === 'story')
    expect(storyQs.length).toBeGreaterThan(0)
  })

  it('includes question_21 with multiple options', () => {
    const questions = getQuestions(mockT, 'en')
    const q21 = questions.find((q) => q.questionId === 'question_21')
    expect(q21).toBeDefined()
    expect(q21?.answerOptions.length).toBeGreaterThan(5)
  })

  it('uses correct audio files for English', () => {
    const questions = getQuestions(mockT, 'en')
    const q1 = questions.find((q) => q.questionId === 'question_1')
    expect(q1?.questionAudio).toContain('/en/')
  })

  it('uses correct audio files for Arabic', () => {
    const questions = getQuestions(mockT, 'ar')
    const q1 = questions.find((q) => q.questionId === 'question_1')
    expect(q1?.questionAudio).toContain('/ar/')
  })
})
