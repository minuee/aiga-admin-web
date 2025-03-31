// Chakra imports
import { Flex, useColorModeValue ,Text} from '@chakra-ui/react';

// Custom components
import { HorizonLogo } from 'components/icons/Icons';
import { HSeparator } from 'components/separator/Separator';
//Left Sidebar 전역상태
import LnbStateStore from 'store/lnbStore';
import LnbSmallStateStore from 'store/lnbSmallStore';

export function SidebarBrand() {
	//   Chakra color mode
	let logoColor = useColorModeValue('navy.700', 'white');
	const isOpen = LnbStateStore(state => state.isOpen);
	const isSmall = LnbSmallStateStore(state => state.isSmall);
	
	return (
		<Flex alignItems='center' flexDirection='column'>
			{/* <HorizonLogo h='26px' w='175px' my='32px' color={logoColor} /> */}
			<Text
				color={logoColor}
				fontWeight="500"
				fontSize={(isSmall && !isOpen) ? "20px" :"30px"}
			>
				{(isSmall && !isOpen)  ? "AA" : "AIGA Admin"}
			</Text>

			<HSeparator mb='30px' mt="30px" />
		</Flex>
	);
}

export default SidebarBrand;
