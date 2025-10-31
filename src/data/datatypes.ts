export interface User {
  id: number;
  username: string;
  email?: string;
  password?: string;
  firstName?: string;
  secondName?: string;
  profileImage?: string;
  description?: string;
  bio?: string;
  likesCount?: number;
  lastLogin?: string;
  creationDate?: string;
  modifiedDate?: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  image?: string;
  authorId: number;
  likesCount: number;
  commentsCount: number;
  creationDate: string;
  modifiedDate: string;
}

export interface Comment {
  id: number;
  text: string;
  authorId: number;
  postId: number;
  creationDate: string;
  modifiedDate: string;
}

export interface Like {
  id: number;
  postId: number;
  authorId: number;
  creationDate: string;
}

export interface Group {
  id: number;
  title: string;
  membersCount: number;
  photo: string;
}


// export const initialUser: User =
// {
//   email: 'admin@gmail.com',
//   password: '12345',
//   name: 'John Doe',
//   bio: 'Junior programmer',
//   avatar: '',
//   recPeople: [
//     { name: 'Helena Hills', nickname: '@helenahills', avatar: '' },
//     { name: 'Charles', nickname: '@charles', avatar: '' },
//     { name: 'Daniel Jay Park', nickname: '@danielj', avatar: '' }
//   ],
//   recCommunities: [
//     { name: 'Photographers of SF', members: 2001, avatar: '' },
//     { name: 'Design Enthusiasts', members: 13714, avatar: '' },
//     { name: 'Marina Crew', members: 125, avatar: '' }
//   ]
// };
