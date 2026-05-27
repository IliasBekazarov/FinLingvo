import { create } from 'zustand'

export const useLessonStore = create((set) => ({
  lessonState: null,
  result:      null,

  saveLessonState: (state) => set({ lessonState: state }),
  clearLessonState: ()    => set({ lessonState: null }),
  saveResult: (r)         => set({ result: r }),
  clearResult: ()         => set({ result: null }),
}))
