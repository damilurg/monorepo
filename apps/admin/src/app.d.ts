declare global {
  namespace App {
    interface Locals {
      isAuthenticated: boolean;
    }
    interface Error {
      message: string;
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      ADMIN_SECRET?: string;
      FLAGS_STORE_PATH?: string;
    }
  }
}

export {};
