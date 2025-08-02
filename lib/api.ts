import { supabase } from "./supabase"
import type { Database } from "./supabase"
import type { Slide } from "../types/slide"

// Content API
export const contentApi = {
  async getContent(language: "tr" | "en", page: string) {
    const { data, error } = await supabase.rpc("get_content", {
      p_language: language,
      p_page: page,
    })

    if (error) throw error
    return data?.[0] || null
  },

  async getAllContents() {
    const { data, error } = await supabase.from("contents").select("*").order("page", { ascending: true })

    if (error) throw error
    return data
  },

  async createContent(content: Database["public"]["Tables"]["contents"]["Insert"]) {
    const { data, error } = await supabase.from("contents").insert(content).select().single()

    if (error) throw error
    return data
  },

  async updateContent(id: string, updates: Database["public"]["Tables"]["contents"]["Update"]) {
    const { data, error } = await supabase.from("contents").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async deleteContent(id: string) {
    const { error } = await supabase.from("contents").delete().eq("id", id)

    if (error) throw error
  },
}

// Projects API
export const projectsApi = {
  async getProjects(language?: "tr" | "en", limit = 10, offset = 0) {
    const { data, error } = await supabase.rpc("get_projects", {
      p_language: language,
      p_limit: limit,
      p_offset: offset,
    })

    if (error) throw error
    return data
  },

  async getProject(id: string) {
    const { data, error } = await supabase
      .from("projects")
      .select(`
        *,
        project_images (*)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  },

  async createProject(project: Database["public"]["Tables"]["projects"]["Insert"]) {
    const { data, error } = await supabase.from("projects").insert(project).select().single()

    if (error) throw error
    return data
  },

  async updateProject(id: string, updates: Database["public"]["Tables"]["projects"]["Update"]) {
    const { data, error } = await supabase.from("projects").update(updates).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async deleteProject(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) throw error
  },
}

// Gallery API
export const galleryApi = {
  async getGallery() {
    const { data, error } = await supabase.rpc("get_gallery")

    if (error) throw error

    // Group by category
    const categories = new Map()
    data?.forEach((item) => {
      if (!categories.has(item.category_id)) {
        categories.set(item.category_id, {
          id: item.category_id,
          title: item.category_title,
          slug: item.category_slug,
          sort_order: item.category_sort_order,
          images: [],
        })
      }

      if (item.image_id) {
        categories.get(item.category_id).images.push({
          id: item.image_id,
          url: item.image_url,
          alt_text: item.image_alt_text,
          sort_order: item.image_sort_order,
        })
      }
    })

    return Array.from(categories.values()).sort((a, b) => a.sort_order - b.sort_order)
  },

  async getCategories() {
    const { data, error } = await supabase
      .from("gallery_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")

    if (error) throw error
    return data
  },
}

// Machine Park API
export const machineParkApi = {
  async getMachines() {
    const { data, error } = await supabase.rpc("get_machine_park")

    if (error) throw error
    return data
  },

  async createMachine(machine: Database["public"]["Tables"]["machine_park"]["Insert"]) {
    const { data, error } = await supabase.from("machine_park").insert(machine).select().single()

    if (error) throw error
    return data
  },
}

// Contact API
export const contactApi = {
  async submitMessage(message: {
    name: string
    surname: string
    email: string
    subject: string
    message: string
    approved_kvkk: boolean
  }) {
    const { data, error } = await supabase.rpc("submit_contact_message", {
      p_name: message.name,
      p_surname: message.surname,
      p_email: message.email,
      p_subject: message.subject,
      p_message: message.message,
      p_approved_kvkk: message.approved_kvkk,
    })

    if (error) throw error
    return data
  },

  async getMessages(limit = 20, offset = 0, unreadOnly = false) {
    const { data, error } = await supabase.rpc("get_contact_messages", {
      p_limit: limit,
      p_offset: offset,
      p_unread_only: unreadOnly,
    })

    if (error) throw error
    return data
  },

  async markAsRead(messageId: string) {
    const { data, error } = await supabase.rpc("mark_message_as_read", {
      p_message_id: messageId,
    })

    if (error) throw error
    return data
  },
}

// Slides API
export const slidesApi = {
  async getActiveSlides() {
    const { data, error } = await supabase.rpc("get_active_slides")

    if (error) throw error
    return data
  },

  async getAllSlides() {
    const { data, error } = await supabase.from("slides").select("*").order("sort_order")

    if (error) throw error
    return data
  },
}

// Storage API
export const storageApi = {
  async uploadImage(file: File, bucket: string, path: string) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) throw error

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return publicUrl
  },

  async deleteImage(bucket: string, path: string) {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) throw error
  },
}

// Slider API
export const sliderApi = {
  async getActiveSlides(): Promise<Slide[]> {
    const { data, error } = await supabase
      .from("slides")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) throw error
    return data || []
  },

  async getAllSlides(): Promise<Slide[]> {
    const { data, error } = await supabase
      .from("slides")
      .select("*")
      .order("sort_order", { ascending: true })

    if (error) throw error
    return data || []
  },

  async createSlide(slide: any): Promise<Slide> {
    const { data, error } = await supabase
      .from("slides")
      .insert(slide)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateSlide(id: string, updates: any): Promise<Slide> {
    const { data, error } = await supabase
      .from("slides")
      .update(updates)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteSlide(id: string): Promise<void> {
    const { error } = await supabase
      .from("slides")
      .delete()
      .eq("id", id)

    if (error) throw error
  },

  async updateSlideOrder(slides: { id: string; sort_order: number }[]): Promise<void> {
    const updates = slides.map(slide => 
      supabase
        .from("slides")
        .update({ sort_order: slide.sort_order })
        .eq("id", slide.id)
    )

    const results = await Promise.all(updates)
    
    for (const result of results) {
      if (result.error) throw result.error
    }
  },
}
