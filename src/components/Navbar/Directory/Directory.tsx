import { ChevronDownIcon } from "@chakra-ui/icons";
import { TiHome } from "react-icons/ti";
import {
    Box,
    Flex,
    Icon,
    Image,
    Menu,
    MenuButton,
    MenuList,
    Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Communities from "./Communities";
import useDirectory from "../../../hooks/useDirectory";

type DirectoryProps = {};

const Directory: React.FC<DirectoryProps> = () => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const { directoryState, toggleMenuOpen } = useDirectory();

    return (
        <Menu isOpen={directoryState.isOpen}>
            {({ isOpen }) => (
                <>
                    <MenuButton
                        cursor="pointer"
                        padding="0 6px"
                        borderRadius={4}
                        _hover={{
                            outline: "1px solid",
                            outlineColor: "gray.200",
                        }}
                        mr={2}
                        ml={{ base: 0, md: 2 }}
                        onClick={toggleMenuOpen}
                    >
                        <Flex
                            align="center"
                            justifyContent="space-between"
                            width={{ base: "auto", lg: "200px" }}
                        >
                            <Flex alignItems="center">
                                <>
                                    {directoryState.selectedMenuItem
                                        .imageURL ? (
                                        <Image
                                            borderRadius="full"
                                            boxSize="24px"
                                            src={
                                                directoryState.selectedMenuItem
                                                    .imageURL
                                            }
                                            mr={2}
                                        />
                                    ) : (
                                        <Icon
                                            fontSize={24}
                                            mr={{ base: 1, md: 2 }}
                                            as={
                                                directoryState.selectedMenuItem
                                                    .icon
                                            }
                                            color={
                                                directoryState.selectedMenuItem
                                                    .iconColor
                                            }
                                        />
                                    )}
                                    <Box
                                        display={{ base: "none", lg: "flex" }}
                                        flexDirection="column"
                                        fontSize="10pt"
                                    >
                                        <Text fontWeight={600}>
                                            {
                                                directoryState.selectedMenuItem
                                                    .displayText
                                            }
                                        </Text>
                                    </Box>
                                </>
                            </Flex>
                            <ChevronDownIcon color="gray.500" />
                        </Flex>
                    </MenuButton>
                    <MenuList
                        maxHeight="300px"
                        overflow="scroll"
                        overflowX="hidden"
                    >
                        <Communities menuOpen={isOpen} />
                    </MenuList>
                </>
            )}
        </Menu>
    );
};
export default Directory;
