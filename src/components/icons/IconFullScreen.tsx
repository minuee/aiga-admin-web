import { Box  } from '@chakra-ui/react';

import { MdFullscreen,MdFullscreenExit } from "react-icons/md";
import { FC, useState,useEffect } from "react";

/* View in fullscreen */
function openFullscreen(element: any) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    /* Safari */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE11 */
    element.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    /* Safari */
    (document as any).webkitExitFullscreen();
  } else if ((document as any).msExitFullscreen) {
    /* IE11 */
    (document as any).msExitFullscreen();
  }
}

const FullscreenButton: FC<any> = ({color,onClick,...props}) => {
    const [fullscreen, setFullscreen] = useState(false);

    // Watch for fullscreenchange
    useEffect(() => {
        function onFullscreenChange() {
            setFullscreen(Boolean(document.fullscreenElement));
        }
          
        document.addEventListener('fullscreenchange', onFullscreenChange);
  
        return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
    }, []);

    return (
        <Box
            mr="5px"
            onClick={(e) => {
                if (fullscreen) closeFullscreen();
                else openFullscreen(document.documentElement);
                setFullscreen(!fullscreen);
                onClick && onClick(e);
            }}
            {...props}
        >
            {fullscreen ? (
                <MdFullscreenExit size={"25px"} />
            ) : (
                <MdFullscreen size={"25px"} />
            )}
        </Box>
    );
};

export default FullscreenButton;
