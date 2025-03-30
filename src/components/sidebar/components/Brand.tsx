// Chakra imports
import { Flex, useColorModeValue ,Text} from '@chakra-ui/react';

// Custom components
import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
	//   Chakra color mode
	let logoColor = useColorModeValue('navy.700', 'white');

	return (
		<Flex alignItems='center' flexDirection='column'>
			{/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
			<Text
				color={logoColor}
				fontWeight="500"
				fontSize="30px"
			>
				AIGA Admin
			</Text>

			<HSeparator mb='30px' mt="30px" />
		</Flex>
	);
}

export default SidebarBrand;
