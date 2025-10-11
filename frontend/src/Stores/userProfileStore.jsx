import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserProfileStore = create(
  persist(
    (set) => ({
      // Default initial state for the user profile
      name: "",
      email: "",
      phone: "",
      facultyId: "",

      // --- ACTIONS ---
      // Action to update the user's name
      setName: (name) => set({ name }),

      // Action to update the user's email
      setEmail: (email) => set({ email }),

      // Action to update the user's phone number
      setPhone: (phone) => set({ phone }),

      // Action to update the faculty ID
      setFacultyId: (facultyId) => set({ facultyId }),
    }),
    {
      // The key to use for storing the data in localStorage
      name: "user-profile-storage",
    }
  )
);

export default useUserProfileStore;
