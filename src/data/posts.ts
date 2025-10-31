export interface Comment {
  user: string;
  text: string;
}

export interface Author {
  name: string;
  avatar?: string;
}

export interface Post {
  author: Author;
  publishTime: Date;
  image?: string;
  caption: string;
  likes: number;
  comments: Comment[];
}

export const defaultPosts: Post[] = [
  {
    author: { name: 'Helena Hills', avatar: '' },
    publishTime: new Date('2025-10-13T08:42:17'),
    image: 'https://i.pinimg.com/736x/a5/32/9b/a5329bab2e151c77ef041fa59e133bad.jpg',
    caption: 'Post description',
    likes: 12,
    comments: [{ user: 'Alex', text: 'Super cool and astonishing' }]
  },
  {
    author: { name: 'Charles', avatar: '' },
    publishTime: new Date('2025-10-11T14:05:33'),
    caption: 'Chillin’ by the ocean 🌊',
    likes: 45,
    comments: [
      { user: 'Sam', text: 'Wish I was there!' },
      { user: 'Jamie', text: 'Looks amazing!' }
    ]
  },
  {
    author: { name: 'Daniel Jay Park', avatar: '' },
    publishTime: new Date('2025-10-09T21:18:02'),
    image: 'https://i.pinimg.com/736x/98/64/42/986442f8aa1b3845237c2105522bbc7c.jpg',
    caption: 'Morning fuel ☕️',
    likes: 28,
    comments: [
      { user: 'Taylor', text: 'What blend is that?' },
      { user: 'Jordan', text: 'I need this every morning!' }
    ]
  }
];
