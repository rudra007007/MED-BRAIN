import type { CommunityPost, CommunityComment } from '../store/community.store';

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: '1',
    userId: 'user-124',
    username: 'User_124',
    content: 'My sleep routine was drifting for weeks. Fixed my bedtime to 10:30pm and already feeling more stable. Small changes can really help.',
    tags: ['Stabilizing'],
    reactions: {
      support: 12,
      strength: 8,
      solidarity: 5,
    },
    commentCount: 3,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    userId: 'user-387',
    username: 'User_387',
    content: 'Screen time was silently affecting my energy levels. Noticed the pattern when I started tracking. Anyone else experienced this?',
    tags: ['Drift detected'],
    reactions: {
      support: 18,
      strength: 3,
      solidarity: 14,
    },
    commentCount: 7,
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: '3',
    userId: 'user-892',
    username: 'User_892',
    content: 'Routine consistency improved after small changes. Started meal prepping on Sundays and it reduced my stress during the week.',
    tags: ['Stabilizing'],
    reactions: {
      support: 23,
      strength: 15,
      solidarity: 9,
    },
    commentCount: 5,
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: '4',
    userId: 'user-561',
    username: 'User_561',
    content: 'Been feeling off lately. My walking routine dropped without me noticing. Going to restart with just 10 minutes a day.',
    tags: ['Recovering'],
    reactions: {
      support: 31,
      strength: 12,
      solidarity: 19,
    },
    commentCount: 11,
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: '5',
    userId: 'user-203',
    username: 'User_203',
    content: 'Hydration makes such a difference. Noticed I was constantly tired until I started tracking water intake. Now aiming for 8 glasses.',
    tags: ['Stabilizing'],
    reactions: {
      support: 27,
      strength: 20,
      solidarity: 11,
    },
    commentCount: 8,
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '6',
    userId: 'user-745',
    username: 'User_745',
    content: 'My mood patterns were connected to irregular eating times. Working on consistent meal schedule now.',
    tags: ['Recovering'],
    reactions: {
      support: 15,
      strength: 9,
      solidarity: 13,
    },
    commentCount: 4,
    timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000), // 1.5 days ago
  },
  {
    id: '7',
    userId: 'user-419',
    username: 'User_419',
    content: 'Realized I was slowly skipping morning stretches. Started again this week and already feeling the difference.',
    tags: ['Stabilizing'],
    reactions: {
      support: 19,
      strength: 14,
      solidarity: 7,
    },
    commentCount: 6,
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '8',
    userId: 'user-638',
    username: 'User_638',
    content: 'Caffeine intake was creeping up without me noticing. Cut back to one coffee before noon and sleep improved significantly.',
    tags: ['Stabilizing'],
    reactions: {
      support: 34,
      strength: 18,
      solidarity: 21,
    },
    commentCount: 9,
    timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000), // 2.5 days ago
  },
];

export const mockCommunityComments: Record<string, CommunityComment[]> = {
  '1': [
    {
      id: 'c1-1',
      postId: '1',
      userId: 'user-456',
      username: 'User_456',
      content: 'This is so helpful. I\'ve been struggling with sleep too. What helped you stick to 10:30pm?',
      reactions: {
        support: 4,
      },
      userReaction: false,
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    },
    {
      id: 'c1-2',
      postId: '1',
      userId: 'user-124',
      username: 'User_124',
      content: 'I set a phone reminder at 10pm to start winding down. Also dimmed lights in my room around that time. Hope this helps!',
      reactions: {
        support: 7,
      },
      userReaction: false,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: 'c1-3',
      postId: '1',
      userId: 'user-789',
      username: 'User_789',
      content: 'Consistency really does make a difference. Keep going!',
      reactions: {
        support: 3,
      },
      userReaction: false,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
    },
  ],
  '2': [
    {
      id: 'c2-1',
      postId: '2',
      userId: 'user-234',
      username: 'User_234',
      content: 'Yes! I noticed the same thing. Reduced screen time an hour before bed and felt more rested.',
      reactions: {
        support: 9,
      },
      userReaction: false,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
    {
      id: 'c2-2',
      postId: '2',
      userId: 'user-567',
      username: 'User_567',
      content: 'Tracking really helps make these patterns visible. Good awareness.',
      reactions: {
        support: 5,
      },
      userReaction: false,
      timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
    },
  ],
  '4': [
    {
      id: 'c4-1',
      postId: '4',
      userId: 'user-891',
      username: 'User_891',
      content: 'Starting small is the way to go. 10 minutes is perfect to rebuild the habit.',
      reactions: {
        support: 6,
      },
      userReaction: false,
      timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000),
    },
    {
      id: 'c4-2',
      postId: '4',
      userId: 'user-345',
      username: 'User_345',
      content: 'You\'ve got this. Recovery is a process, not a race.',
      reactions: {
        support: 11,
      },
      userReaction: false,
      timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000),
    },
  ],
};
