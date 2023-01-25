import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Community } from "../../atoms/communitiesAtom";
import { firestore } from "../../firebase/clientApp";

type PostsProps = {
    communityData?: Community;
    userId?: string;
    loadingUser: boolean;
};

const Posts: React.FC<PostsProps> = ({
    communityData,
    userId,
    loadingUser,
}) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const getPosts = async () => {
        setLoading(true);

        try {
            const postsQuery = query(
                collection(firestore, "posts"),
                where("communityId", "==", communityData?.id!),
                orderBy("createdAt", "desc"),
            );

            const postDocs = await getDocs(postsQuery);
            const posts = postDocs.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            console.log("posts", posts);
        } catch (err) {
            console.log("error", err);
        }
    };

    useEffect(() => {
        getPosts();
    }, []);

    // const { postStateValue, setPostStateValue, onVote, onDeletePost } = usePost
    return <div>Have a good coding</div>;
};
export default Posts;
