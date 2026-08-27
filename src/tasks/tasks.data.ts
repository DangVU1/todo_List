
export interface Tasks { 
    id: number; 
    title: string; 
    completed: boolean; 
    createdAt: string; 
    updatedAt: string; 
    deletedAt: string | null; 
} 

export const tasks: Tasks[]= [{ 
    id: 1,
    title: "learn batminton", 
    completed: false, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null
  },{ 
    id: 2,
    title: "hide from Tran Thanh", 
    completed: true, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: new Date().toISOString(),
  },{ 
    id: 3,
    title: "learn how to eat", 
    completed: true, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: new Date().toISOString(),
  },{ 
    id: 4,
    title: "sleep", 
    completed: true, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null
  },{ 
    id: 5,
    title: "learn NestJs", 
    completed: false, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null,
  },{ 
    id: 6,
    title: "learn sleep again", 
    completed: false, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null
  },{ 
    id: 7,
    title: "coding tasks", 
    completed: false, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null
  },{ 
    id: 8,
    title: "eat after learn how to", 
    completed: true, 
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    deletedAt: null
  }
]
