import { createAssessment, updateScores } from '@/services/appwrite'
import { Databases, ID, Query } from 'appwrite'

jest.mock('appwrite', () => ({
  ...jest.requireActual('appwrite'),
  ID: {
    unique: jest.fn(() => 'mock-unique-id'),
  },
  Query: {
    equal: jest.fn((field, value) => ({ field, value })),
  },
}))

describe('appwrite service', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID = 'db'
    process.env.NEXT_PUBLIC_APPWRITE_STUDENTS_COLLECTION_ID = 'students'
    process.env.NEXT_PUBLIC_APPWRITE_ASSESSMENTS_COLLECTION_ID = 'assessments'
    process.env.NEXT_PUBLIC_APPWRITE_SCORES_COLLECTION_ID = 'scores'
  })

  describe('createAssessment', () => {
    it('calls createDocument with correct parameters and returns value', async () => {
      const data = {
        school: 'School 1',
        grade: 'Grade 1',
        overallScore: 25,
        scores: '{"question_1":3,"question_2":1}',
        skillScores: '{"self_awareness":7,"social_management":5}',
        answers: '{"0":"1","1":"2"}',
        testType: 'assessment',
      }
      const mockResult = { id: 'a1' }
      const docSpy = jest
        .spyOn(Databases.prototype, 'createDocument')
        .mockResolvedValue(mockResult as any)
      const result = await createAssessment(data)
      expect(docSpy).toHaveBeenCalledWith(
        'db',
        'students',
        'mock-unique-id',
        data,
      )
      expect(result).toBe(mockResult)
    })
  })

  describe('updateScores', () => {
    it('creates new document when no existing document found', async () => {
      const listSpy = jest
        .spyOn(Databases.prototype, 'listDocuments')
        .mockResolvedValue({ documents: [] } as any)
      const createSpy = jest
        .spyOn(Databases.prototype, 'createDocument')
        .mockResolvedValue({} as any)

      await updateScores({
        skillScores: { self_awareness: 2.0, social_management: 1.0 },
        school: 'School 1',
        grade: 'Grade 1',
        section: 'A',
        zone: 'Zone 1',
        assessment: 'child',
        overallScore: 2.5,
        testType: 'PRE',
      })

      expect(listSpy).toHaveBeenCalled()
      expect(createSpy).toHaveBeenCalledWith(
        'db',
        'scores',
        'unique()',
        expect.objectContaining({
          school: 'School 1',
          grade: 'Grade 1',
          section: 'A',
          zone: 'Zone 1',
          assessment: 'child',
          testType: 'PRE',
          total_students: 1,
        }),
      )
    })

    it('creates document with beginner level for overallScore < 1.5', async () => {
      const listSpy = jest
        .spyOn(Databases.prototype, 'listDocuments')
        .mockResolvedValue({ documents: [] } as any)
      const createSpy = jest
        .spyOn(Databases.prototype, 'createDocument')
        .mockResolvedValue({} as any)

      await updateScores({
        skillScores: { self_awareness: 1.0 },
        school: 'School 1',
        grade: 'Grade 1',
        section: 'A',
        zone: 'Zone 1',
        assessment: 'child',
        overallScore: 1.0,
        testType: 'PRE',
      })

      const createCall = createSpy.mock.calls[0]
      const overallDist = JSON.parse((createCall[3] as any).overall_level_distribution)
      expect(overallDist.beginner).toBe(1)
      expect(overallDist.learner).toBe(0)
      expect(overallDist.expert).toBe(0)
    })

    it('creates document with learner level for overallScore >= 1.5 and < 2.4', async () => {
      const listSpy = jest
        .spyOn(Databases.prototype, 'listDocuments')
        .mockResolvedValue({ documents: [] } as any)
      const createSpy = jest
        .spyOn(Databases.prototype, 'createDocument')
        .mockResolvedValue({} as any)

      await updateScores({
        skillScores: { self_awareness: 2.0 },
        school: 'School 1',
        grade: 'Grade 1',
        section: 'A',
        zone: 'Zone 1',
        assessment: 'child',
        overallScore: 2.0,
        testType: 'PRE',
      })

      const createCall = createSpy.mock.calls[0]
      const overallDist = JSON.parse((createCall[3] as any).overall_level_distribution)
      expect(overallDist.beginner).toBe(0)
      expect(overallDist.learner).toBe(1)
      expect(overallDist.expert).toBe(0)
    })

    it('creates document with expert level for overallScore >= 2.4', async () => {
      const listSpy = jest
        .spyOn(Databases.prototype, 'listDocuments')
        .mockResolvedValue({ documents: [] } as any)
      const createSpy = jest
        .spyOn(Databases.prototype, 'createDocument')
        .mockResolvedValue({} as any)

      await updateScores({
        skillScores: { self_awareness: 3.0 },
        school: 'School 1',
        grade: 'Grade 1',
        section: 'A',
        zone: 'Zone 1',
        assessment: 'child',
        overallScore: 3.0,
        testType: 'PRE',
      })

      const createCall = createSpy.mock.calls[0]
      const overallDist = JSON.parse((createCall[3] as any).overall_level_distribution)
      expect(overallDist.beginner).toBe(0)
      expect(overallDist.learner).toBe(0)
      expect(overallDist.expert).toBe(1)
    })

    it('updates existing document when document found', async () => {
      const existingDoc = {
        $id: 'doc-123',
        total_students: 5,
        overall_level_distribution: JSON.stringify({
          beginner: 2,
          learner: 2,
          expert: 1,
        }),
        category_level_distributions: JSON.stringify({
          self_awareness: { beginner: 1, learner: 1, expert: 0 },
        }),
      }

      const listSpy = jest
        .spyOn(Databases.prototype, 'listDocuments')
        .mockResolvedValue({ documents: [existingDoc] } as any)
      const updateSpy = jest
        .spyOn(Databases.prototype, 'updateDocument')
        .mockResolvedValue({} as any)

      await updateScores({
        skillScores: { self_awareness: 2.5, social_management: 1.2 },
        school: 'School 1',
        grade: 'Grade 1',
        section: 'A',
        zone: 'Zone 1',
        assessment: 'child',
        overallScore: 2.5,
        testType: 'PRE',
      })

      expect(updateSpy).toHaveBeenCalledWith(
        'db',
        'scores',
        'doc-123',
        expect.objectContaining({
          total_students: 6,
        }),
      )

      const updateCall = updateSpy.mock.calls[0]
      const newOverall = JSON.parse((updateCall[3] as any).overall_level_distribution)
      expect(newOverall.expert).toBe(2) // incremented from 1

      const newCategoryDist = JSON.parse(
        (updateCall[3] as any).category_level_distributions,
      )
      expect(newCategoryDist.self_awareness.expert).toBe(1) // incremented
      expect(newCategoryDist.social_management.beginner).toBe(1) // new category
    })

    it('handles missing overall_level_distribution in existing document', async () => {
      const existingDoc = {
        $id: 'doc-123',
        total_students: 5,
        category_level_distributions: JSON.stringify({}),
      }

      jest
        .spyOn(Databases.prototype, 'listDocuments')
        .mockResolvedValue({ documents: [existingDoc] } as any)
      const updateSpy = jest
        .spyOn(Databases.prototype, 'updateDocument')
        .mockResolvedValue({} as any)

      await updateScores({
        skillScores: { self_awareness: 2.5 },
        school: 'School 1',
        grade: 'Grade 1',
        section: 'A',
        zone: 'Zone 1',
        assessment: 'child',
        overallScore: 2.5,
        testType: 'PRE',
      })

      expect(updateSpy).toHaveBeenCalled()
    })

    it('handles missing category_level_distributions in existing document', async () => {
      const existingDoc = {
        $id: 'doc-123',
        total_students: 5,
        overall_level_distribution: JSON.stringify({
          beginner: 2,
          learner: 2,
          expert: 1,
        }),
      }

      jest
        .spyOn(Databases.prototype, 'listDocuments')
        .mockResolvedValue({ documents: [existingDoc] } as any)
      const updateSpy = jest
        .spyOn(Databases.prototype, 'updateDocument')
        .mockResolvedValue({} as any)

      await updateScores({
        skillScores: { self_awareness: 2.5 },
        school: 'School 1',
        grade: 'Grade 1',
        section: 'A',
        zone: 'Zone 1',
        assessment: 'child',
        overallScore: 2.5,
        testType: 'PRE',
      })

      expect(updateSpy).toHaveBeenCalled()
    })

    it('handles missing total_students in existing document', async () => {
      const existingDoc = {
        $id: 'doc-123',
        overall_level_distribution: JSON.stringify({
          beginner: 2,
          learner: 2,
          expert: 1,
        }),
        category_level_distributions: JSON.stringify({}),
      }

      jest
        .spyOn(Databases.prototype, 'listDocuments')
        .mockResolvedValue({ documents: [existingDoc] } as any)
      const updateSpy = jest
        .spyOn(Databases.prototype, 'updateDocument')
        .mockResolvedValue({} as any)

      await updateScores({
        skillScores: { self_awareness: 2.5 },
        school: 'School 1',
        grade: 'Grade 1',
        section: 'A',
        zone: 'Zone 1',
        assessment: 'child',
        overallScore: 2.5,
        testType: 'PRE',
      })

      const updateCall = updateSpy.mock.calls[0]
      expect((updateCall[3] as any).total_students).toBe(1) // 0 + 1
    })
  })
})
