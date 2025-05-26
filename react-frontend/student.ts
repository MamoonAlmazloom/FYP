export interface Project {
  project_id: number;
  title: string;
  description: string;
  supervisor_name?: string;
}

export interface Proposal {
  proposal_id: number;
  title: string;
  description: string;
  status_name: string;
  project_id?: number;
}

export interface Supervisor {
  user_id: number;
  name: string;
  email: string;
}

export interface StudentUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
}
