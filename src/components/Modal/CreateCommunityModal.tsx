import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import React from "react";

type CreateCommunityModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
    children,
    isOpen,
    onClose,
}) => {
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
                <ModalOverlay />
                <ModalContent width={{ base: "sm", md: "xl" }}>
                    {children}
                </ModalContent>
            </Modal>
        </>
    );
};
export default CreateCommunityModal;
