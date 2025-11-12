export type RowObj = {
	nickname: string;
	hospitalName : string;
	doctorName : string;
	kindness_score : number;
	explaination_score : number;
	satisfaction_score : number;
	recommand_score : number;
	createAt : string;
	content : string;
	doctor_basic?: {
        doctorname: string;
		doctor_id : string;
		deptname : string;
		hospital? : {
			shortName : string
		}
        // 다른 필요한 속성들 ...
    };
};

const tableDataReview: RowObj[] = [
	{
		nickname: "홍길동",
		hospitalName : "홍길동병원",
		doctorName : "홍길순",
		kindness_score : 1,
		explaination_score : 1,
		satisfaction_score : 1,
		recommand_score : 1,
		createAt : "2025-01-01",
		content : "매우 좋아요"
	},
	{
		nickname: "홍길동2",
		hospitalName : "홍길동병원",
		doctorName : "홍길순",
		kindness_score : 5,
		explaination_score : 5,
		satisfaction_score : 5,
		recommand_score : 5,
		createAt : "2025-03-01",
		content : "매우 좋아요"
	},
];

export default tableDataReview;
