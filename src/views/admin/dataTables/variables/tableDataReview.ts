export type RowObj = {
	name: string;
	hospitalName : string;
	doctorName : string;
	ratingKind : number;
	ratingTreatment : number;
	ratingDialog : number;
	ratingRecommend : number;
	regDate : string;
	comment : string;
};

const tableDataReview: RowObj[] = [
	{
		name: "홍길동",
		hospitalName : "홍길동병원",
		doctorName : "홍길순",
		ratingKind : 1,
		ratingTreatment : 1,
		ratingDialog : 1,
		ratingRecommend : 1,
		regDate : "2025-01-01",
		comment : "매우 좋아요"
	},
	{
		name: "홍길동2",
		hospitalName : "홍길동병원",
		doctorName : "홍길순",
		ratingKind : 5,
		ratingTreatment : 5,
		ratingDialog : 5,
		ratingRecommend : 5,
		regDate : "2025-03-01",
		comment : "매우 좋아요"
	},
];

export default tableDataReview;
