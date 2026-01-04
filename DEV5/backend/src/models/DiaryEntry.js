import mongoose from "mongoose";

const diaryEntrySchema = new mongoose.Schema(
	{
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

		date: { type: Date, required: true },
		zodiacSign: { type: String, required: true },

		promptText: { type: String, required: true },

		answers: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("DiaryEntry", diaryEntrySchema);
