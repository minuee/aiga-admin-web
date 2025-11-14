export type RowObj = {
	nickname: string;
	content : string;
	createAt : string;
	is_clear : string;
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

const tableDataInquiry: RowObj[] = [
];

export default tableDataInquiry;
