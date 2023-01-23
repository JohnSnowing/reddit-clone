import { Flex, Icon } from "@chakra-ui/react";
import { User } from "firebase/auth";
import React, { useState, useRef } from "react";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { BiPoll } from "react-icons/bi";
import TabItems from "./TabItem";
import TextInputs from "./TextInputs";
import { useRouter } from "next/router";
import ImageUpload from "./ImageUpload";
import {
    addDoc,
    collection,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "../../../firebase/clientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useSetRecoilState } from "recoil";
import { postState } from "../../../atoms/postsAtom";

const formTabs = [
    {
        title: "Post",
        icon: IoDocumentText,
    },
    {
        title: "Images & Video",
        icon: IoImageOutline,
    },
    {
        title: "Link",
        icon: BsLink45Deg,
    },
    {
        title: "Poll",
        icon: BiPoll,
    },
    {
        title: "Talk",
        icon: BsMic,
    },
];

export type TabItem = {
    title: string;
    icon: typeof Icon.arguments;
};

type NewPostFormProps = {
    communityId: string;
    communityImageURL?: string;
    user: User;
};

const NewPostForm: React.FC<NewPostFormProps> = ({
    communityId,
    communityImageURL,
    user,
}) => {
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
    const [textInputs, setTextInputs] = useState({ title: "", body: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedFile, setSelectedFile] = useState<string>();
    const selectFileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const setPostItems = useSetRecoilState(postState);

    console.log("community", communityId, communityImageURL);

    const handleCreatePost = async () => {
        setLoading(true);
        const { title, body } = textInputs;
        try {
            const postDocRef = await addDoc(collection(firestore, "posts"), {
                communityId,
                communityImageURL: communityImageURL || "",
                creatorId: user.uid,
                userDisplayText: user.email!.split("@")[0],
                title,
                body,
                numberOfComments: 0,
                voteStatus: 0,
                createdAt: serverTimestamp(),
                editedAt: serverTimestamp(),
            });

            console.log("NEW post ID", postDocRef.id);

            // check if selectedFile exists, if it does, do image processing
            if (selectedFile) {
                const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                await uploadString(imageRef, selectedFile, "data_url");
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(postDocRef, {
                    imageUrl: downloadURL,
                });

                console.log("download URL", downloadURL);
            }

            setPostItems((prev) => ({
                ...prev,
                postUpdateRequired: true,
            }));

            router.back();
        } catch (e) {
            console.log("create Post", error);
            setError("Error creating post");
        }
        setLoading(false);
    };

    const onTextChange = ({
        target: { name, value },
    }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTextInputs((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader();
        if (event.target.files?.[0]) {
            reader.readAsDataURL(event.target.files[0]);
        }

        reader.onload = (readerEvent) => {
            if (readerEvent.target?.result) {
                setSelectedFile(readerEvent.target?.result as string);
            }
        };
    };
    return (
        <Flex direction="column" bg="white" borderRadius={4} mt={2}>
            <Flex width="100%">
                {formTabs.map((item, index) => (
                    <TabItems
                        key={index}
                        item={item}
                        selected={item.title === selectedTab}
                        setSelectedTab={setSelectedTab}
                    />
                ))}
            </Flex>
            <Flex p={4}>
                {selectedTab === "Post" && (
                    <TextInputs
                        textInputs={textInputs}
                        onChange={onTextChange}
                        handleCreatePost={handleCreatePost}
                        loading={loading}
                    />
                )}
                {selectedTab === "Images & Video" && (
                    <ImageUpload
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        setSelectedTab={setSelectedTab}
                        selectFileRef={selectFileRef}
                        onSelectImage={onSelectImage}
                    />
                )}
            </Flex>
        </Flex>
    );
};
export default NewPostForm;
