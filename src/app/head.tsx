import React from "react";

export default function RootHead() {
	return <>
			<link rel="apple-touch-icon" href={process.env.NEXT_PUBLIC_ASSETS_PREFIX + "/apple-icon.png"} />
			{/* <link rel="/manifest" href={process.env.NEXT_PUBLIC_ASSETS_PREFIX +"/manifest.json"} /> */}
			<link rel="robots" href={process.env.NEXT_PUBLIC_ASSETS_PREFIX + "/robots.txt"} />
			<link
				rel="shortcut icon"
				type="image/x-icon"
				href={process.env.NEXT_PUBLIC_ASSETS_PREFIX + '/favicon.ico'}
			/>

		  	<title>AIGA Admin Page</title>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="theme-color" content="#000000" />
		</>
}