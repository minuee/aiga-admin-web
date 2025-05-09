export type RowObj = {
	name: string;
	joinType: string;
	grade : string;
	regDate : string;
	useTokens : number;
	regReview : number;
	isActive : boolean;
	isEntire : boolean;
};

const tableDataMembers: RowObj[] = [
	{
		name: "홍길동",
		joinType: 'naver',
		grade: 'Bronze',
		regDate: '2025.04.05',
		useTokens: 100,
		regReview: 0,
		isActive: true,
		isEntire: false
	},
	{
		name: "홍길슨",
		joinType: 'kakao',
		grade: 'Silver',
		regDate: '2025.04.05',
		useTokens: 1000,
		regReview: 1,
		isActive: true,
		isEntire: false
	},
	{
		name: "홍길동",
		joinType: 'aiga',
		grade: 'Platinum',
		regDate: '2025.04.05',
		useTokens: 10000,
		regReview: 3,
		isActive: true,
		isEntire: false
	},
];

export default tableDataMembers;
