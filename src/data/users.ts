export interface Person {
  name: string;
  nickname: string;
  avatar?: string;
}

export interface Community {
  name: string;
  members: number;
  avatar?: string;
}

export interface User {
  email: string;
  password: string;
  name: string;
  bio: string;
  avatar?: string;
  recPeople: Person[];
  recCommunities: Community[];
}

export const initialUsers: User[] = [
  {
    email: 'admin@gmail.com',
    password: '12345',
    name: 'John Doe',
    bio: 'Junior programmer',
    avatar: '',
    recPeople: [
      { name: 'Helena Hills', nickname: '@helenahills', avatar: '' },
      { name: 'Charles', nickname: '@charles', avatar: '' },
      { name: 'Daniel Jay Park', nickname: '@danielj', avatar: '' }
    ],
    recCommunities: [
      { name: 'Photographers of SF', members: 2001, avatar: '' },
      { name: 'Design Enthusiasts', members: 13714, avatar: '' },
      { name: 'Marina Crew', members: 125, avatar: '' }
    ]
  }
];
