export interface Author {
  name?: string
  url?: string
}

export interface TopicData {
  topic: string
  perspectives: string[]
  postText?: string
  postUrl?: string
  author?: Author
}

export interface SSEStatusData {
  message: string
  step?: number
}

export interface SSEPostsData {
  count: number
}

export interface SSESelectedData {
  count: number
}

export interface SSEProgressData {
  current: number
  total: number
  message: string
}

export interface SSETopicData {
  postId: string
  topic: string
  postIndex: number
  postText?: string
  postUrl?: string
  author?: Author
}

export interface SSEPerspectivesData {
  postId: string
  topic: string
  perspectives: string[]
}

export interface SSECompleteData {
  postId: string
}

export interface SSEErrorData {
  message?: string
  error?: string
  postId?: string
}

export interface EmailChunkData {
  chunk: string
}

export interface EmailCompleteData {
  email: string
}


