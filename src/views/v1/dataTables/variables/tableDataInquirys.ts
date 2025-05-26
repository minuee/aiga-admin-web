export type RowObj = {
	name: string;
	contactInfo : string;
	relation : string;
	regDate : string;
	comment : string;
	isCleared : boolean;
	clearDate : string;
	clearAdmin : string;
};

const tableDataInquiry: RowObj[] = [
	{
		name: "홍길동",
		contactInfo: 'email@naver.com',
		relation: '본인',
		regDate: '2025.04.05',
		comment: "fjlfjdlfjdlkfjdlkfjdlfjdlkfjdlfjdlfjdlfdjlfdj",
		isCleared: false,
		clearDate: '',
		clearAdmin: ''
	},
	{
		name: "홍길순",
		contactInfo: 'email@naver.com',
		relation: '관계자',
		regDate: '2025.04.05',
		comment: "fjlfjdlfjdlkfjdlkfjdlfjdlkfjdlfjdlfjdlfdjlfdj",
		isCleared: true,
		clearDate: '2025.04.10',
		clearAdmin: '관리자'
	},
];

export default tableDataInquiry;
