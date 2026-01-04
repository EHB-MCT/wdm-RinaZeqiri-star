import mongoose from "mongoose";

const diaryEntrySchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},

		date: {
			type: Date,
			required: true,
		},

		zodiacSign: {
			type: String,
			required: true,
		},

		promptText: {
			type: String,
			required: true,
		},

		answers: {
			type: mongoose.Schema.Types.Mixed,
			required: true,
		},

		analysis: {
			sentiment: {
				type: String,
			},
			sentimentScore: {
				type: Number,
			},

			emotions: [
				{
					type: String,
				},
			],

			topics: [
				{
					type: String,
				},
			],

			peopleMentioned: [
				{
					type: {
						type: String,
					},
					name: {
						type: String,
						default: null,
					},
				},
			],
		},
	},
	{ timestamps: true }
);

export default mongoose.model("DiaryEntry", diaryEntrySchema);
