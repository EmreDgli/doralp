import { supabase } from "./supabase"
import type { Database } from "./supabase"

// Admin authentication
export const adminAuth = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    // Verify admin status
    const { data: adminUser, error: adminError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", data.user.id)
      .eq("is_active", true)
      .single()

    if (adminError || !adminUser) {
      await supabase.auth.signOut()
      throw new Error("Unauthorized: Admin access required")
    }

    return { user: data.user, adminUser }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentAdmin() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) return null

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .eq("is_active", true)
      .single()

    return adminUser ? { user, adminUser } : null
  },
}

// Dashboard API
export const dashboardApi = {
  async getStats() {
    const { data, error } = await supabase.rpc("get_admin_dashboard_stats")
    if (error) throw error
    return data
  },

  async getActivityLog(adminId?: string, limit = 50, offset = 0) {
    const { data, error } = await supabase.rpc("get_admin_activity_log", {
      p_admin_id: adminId || null,
      p_limit: limit,
      p_offset: offset,
    })
    if (error) throw error
    return data
  },
}

// Contents API
export const adminContentApi = {
  async getContents(
    filters: {
      language?: "tr" | "en"
      page?: string
      limit?: number
      offset?: number
    } = {},
  ) {
    const { data, error } = await supabase.rpc("get_admin_contents", {
      p_language: filters.language || null,
      p_page: filters.page || null,
      p_limit: filters.limit || 20,
      p_offset: filters.offset || 0,
    })
    if (error) throw error
    return data
  },

  async getContent(id: string) {
    const { data, error } = await supabase.from("contents").select("*").eq("id", id).single()
    if (error) throw error
    return data
  },

  async createContent(content: Database["public"]["Tables"]["contents"]["Insert"]) {
    const { data, error } = await supabase
      .from("contents")
      .insert({
        ...content,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateContent(id: string, updates: Database["public"]["Tables"]["contents"]["Update"]) {
    const { data, error } = await supabase
      .from("contents")
      .update({
        ...updates,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteContent(id: string) {
    const { error } = await supabase.from("contents").delete().eq("id", id)
    if (error) throw error
  },
}

// Projects API
export const adminProjectsApi = {
  async getProjects(
    filters: {
      language?: "tr" | "en"
      category?: string
      isPublished?: boolean
      limit?: number
      offset?: number
    } = {},
  ) {
    const { data, error } = await supabase.rpc("get_admin_projects", {
      p_language: filters.language || null,
      p_category: filters.category || null,
      p_is_published: filters.isPublished || null,
      p_limit: filters.limit || 20,
      p_offset: filters.offset || 0,
    })
    if (error) throw error
    return data
  },

  async getProject(id: string) {
    const { data, error } = await supabase
      .from("projects")
      .select(
        `
        *,
        project_images (*)
      `,
      )
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  },

  async createProject(project: Database["public"]["Tables"]["projects"]["Insert"]) {
    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...project,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateProject(id: string, updates: Database["public"]["Tables"]["projects"]["Update"]) {
    const { data, error } = await supabase
      .from("projects")
      .update({
        ...updates,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProject(id: string) {
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) throw error
  },

  async addProjectImage(
    projectId: string,
    imageData: {
      image_url: string
      alt_text?: string
      caption?: string
      is_primary?: boolean
      sort_order?: number
      file_size?: number
      file_type?: string
    },
  ) {
    const { data, error } = await supabase
      .from("project_images")
      .insert({
        project_id: projectId,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        ...imageData,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteProjectImage(imageId: string) {
    const { error } = await supabase.from("project_images").delete().eq("id", imageId)
    if (error) throw error
  },
}

// Contact Messages API
export const adminContactApi = {
  async getMessages(filters: { isRead?: boolean; limit?: number; offset?: number } = {}) {
    const { data, error } = await supabase.rpc("get_admin_contact_messages", {
      p_is_read: filters.isRead || null,
      p_limit: filters.limit || 20,
      p_offset: filters.offset || 0,
    })
    if (error) throw error
    return data
  },

  async updateMessageStatus(messageId: string, isRead?: boolean, adminNotes?: string) {
    const { data, error } = await supabase.rpc("update_contact_message_status", {
      p_message_id: messageId,
      p_is_read: isRead || null,
      p_admin_notes: adminNotes || null,
    })
    if (error) throw error
    return data
  },

  async archiveMessage(messageId: string) {
    const { error } = await supabase.from("contact_messages").update({ is_archived: true }).eq("id", messageId)

    if (error) throw error
  },
}

// Gallery API
export const adminGalleryApi = {
  async getGallery() {
    const { data, error } = await supabase.rpc("get_admin_gallery")
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
          is_active: item.category_is_active,
          created_by: item.category_created_by,
          images: [],
        })
      }

      if (item.image_id) {
        categories.get(item.category_id).images.push({
          id: item.image_id,
          url: item.image_url,
          alt_text: item.image_alt_text,
          sort_order: item.image_sort_order,
          is_active: item.image_is_active,
          file_size: item.image_file_size,
          created_by: item.image_created_by,
        })
      }
    })

    return Array.from(categories.values()).sort((a, b) => a.sort_order - b.sort_order)
  },

  async createCategory(category: {
    title: string
    slug: string
    description?: string
    sort_order?: number
  }) {
    const { data, error } = await supabase
      .from("gallery_categories")
      .insert({
        ...category,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async addImage(
    categoryId: string,
    imageData: {
      image_url: string
      alt_text?: string
      caption?: string
      sort_order?: number
      file_size?: number
      file_type?: string
    },
  ) {
    const { data, error } = await supabase
      .from("gallery_images")
      .insert({
        category_id: categoryId,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        ...imageData,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },
}

// Slides API
export const adminSlidesApi = {
  async getSlides() {
    const { data, error } = await supabase.from("slides").select("*").order("sort_order")
    if (error) throw error
    return data
  },

  async createSlide(slide: Database["public"]["Tables"]["slides"]["Insert"]) {
    const { data, error } = await supabase
      .from("slides")
      .insert({
        ...slide,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateSlide(id: string, updates: Database["public"]["Tables"]["slides"]["Update"]) {
    const { data, error } = await supabase
      .from("slides")
      .update({
        ...updates,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteSlide(id: string) {
    const { error } = await supabase.from("slides").delete().eq("id", id)
    if (error) throw error
  },

  async updateSortOrders(updates: Array<{ id: string; sort_order: number }>) {
    const { data, error } = await supabase.rpc("update_sort_orders", {
      p_table_name: "slides",
      p_updates: updates,
    })
    if (error) throw error
    return data
  },
}

// Storage API for admin
export const adminStorageApi = {
  async uploadImage(file: File, bucket: string, folder = "") {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      throw new Error("Authentication required for file upload")
    }

    // Validate file
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

    if (file.size > maxSize) {
      throw new Error("File size must be less than 5MB")
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG, and WebP images are allowed")
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${folder}${folder ? "/" : ""}${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    console.log("Uploading file:", {
      bucket,
      fileName,
      fileSize: file.size,
      userId: user.id
    })

    const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Storage upload error:", error)
      throw error
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path)

    return {
      url: publicUrl,
      path: data.path,
      size: file.size,
      type: file.type,
    }
  },

  async deleteImage(bucket: string, path: string) {
    const { error } = await supabase.storage.from(bucket).remove([path])
    if (error) throw error
  },

  async listImages(bucket: string, folder = "") {
    const { data, error } = await supabase.storage.from(bucket).list(folder)
    if (error) throw error
    return data
  },
}
