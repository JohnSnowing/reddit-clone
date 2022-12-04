import { ChevronDownIcon } from "@chakra-ui/icons";
import { TiHome } from "react-icons/ti";
import { Flex, Icon, Menu, MenuButton, MenuList, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import Communities from "./Communities";

type DirectoryProps = {};

const Directory: React.FC<DirectoryProps> = () => {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    return (
        <Menu>
            <MenuButton
                cursor="pointer"
                padding="0 6px"
                borderRadius={4}
                _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
                mr={2}
                ml={{ base: 0, md: 2 }}
            >
                <Flex
                    align="center"
                    justifyContent="space-between"
                    width={{ base: "auto", lg: "200px" }}
                >
                    <Flex align="center">
                        <Icon
                            fontSize={24}
                            mr={{ base: 1, md: 2 }}
                            as={TiHome}
                        />
                        <Flex display={{ base: "none", lg: "flex" }}>
                            <Text fontWeight={600} fontSize="10pt">
                                Home
                            </Text>
                        </Flex>
                    </Flex>
                    <ChevronDownIcon />
                </Flex>
            </MenuButton>
            <MenuList>
                <Communities />
            </MenuList>
        </Menu>
    );
};
export default Directory;
