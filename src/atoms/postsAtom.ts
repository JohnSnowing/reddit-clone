import { Timestamp } from "firebase/firestore";
import { atom } from "recoil";
export type Post = {
    id: string;
    communityId: string;
    communityImageUrl?: string;
    userDisplayText: string;
    creatorId: string;
    title: string;
    body: string;
    numberOfComments: number;
    voteStatus: number;
    currentUserVotesStatus?: {
        id: string;
        voteValue: number;
    };
    imageUrl?: string;
    postIdx?: number;
    createdAt?: Timestamp;
    editedAt?: Timestamp;
};

export type PostVote = {
    id?: string;
    postId: string;
    communityId: string;
    voteValue: number;
};

interface PostState {
    selectedPost: Post | null;
    posts: Post[];
    postVotes: PostVote[];
    postsCache: {
        [key: string]: Post[];
    };
    postUpdateRequired: boolean;
}

export const defaultPostState: PostState = {
    selectedPost: null,
    posts: [],
    postVotes: [],
    postsCache: {},
    postUpdateRequired: true,
};

export const postState = atom({
    key: "postState",
    default: defaultPostState,
});
