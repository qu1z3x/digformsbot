import TelegramBot from "node-telegram-bot-api";
import cron from "node-cron";

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

import { sendDataAboutButton } from "./tgterminal.js";
import { sendDataAboutError } from "./tgterminal.js";
import { sendDataAboutAction } from "./tgterminal.js";
import { chat_v1 } from "googleapis";

const TOKENs = [
	"6654105779:AAEnCdIzKS_cgJUg4rMY8yNM3LPP5iZ-d_A",
	"6742129950:AAF0x4esK6JxkuSVr2IoyHSVWA-7gKDmZ_U",
];

const TOKEN = TOKENs[1]; // 1 - оригинал
const bot = new TelegramBot(TOKEN, { polling: true });

const qu1z3xId = "923690530";
const stepanovId = "5786876945";
const jackId = "6815420098";
let BotName = "sch27masterclass";

//? МАССИВЫ ДАННЫХ

let usersData = [];
let timeGroups = [
	{ time: "15:00", listedUsers: ["333"], maxCountOfSeats: 41 },
	{ time: "16:30", listedUsers: ["333"], maxCountOfSeats: 41 },
	{ time: "18:00", listedUsers: ["333"], maxCountOfSeats: 26 },
];
let masterClassFeedbacks = [];

const firebaseConfig = {
	apiKey: "AIzaSyBy6yyzbKDNXslvbMo51uJMiCpcuL4CnJE",
	authDomain: "digschraspisanie.firebaseapp.com",
	databaseURL: "https://digschraspisanie-default-rtdb.firebaseio.com",
	projectId: "digschraspisanie",
	storageBucket: "digschraspisanie.appspot.com",
	messagingSenderId: "831815158500",
	appId: "1:831815158500:web:3059c65379b4317ff33af1",
	measurementId: "G-9Z5EGQ2GBM",
};
const app = initializeApp(firebaseConfig);

// Получение ссылки на базу данных Firebase Realtime Database
const db = getDatabase(app);
const dataRef = ref(db);

let textMessageForAllUsers = "";

bot.setMyCommands([
	{
		command: "/restart",
		description: "Перезапуск",
	},
]);

//? ФУНКЦИИ

async function firstMeeting(chatId, meetingStage = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		switch (meetingStage) {
			case 1:
				dataAboutUser.userAction = "-";
				await bot.editMessageText(
					`<b>Вас приветствует МБОУ СОШ №27.</b>\nВ связи с <b>усилением мер по безопасности,</b> время проведения кулинарного мастер-класса <b>было изменено.</b> Так-же изменилось <b>количество мест</b> на мастер-класс. \nДля проведения мастер-класса сформированы <b>две детские</b> группы и <b>одна взрослая.</b> <b>В детских группах</b> по <b>40 мест,</b> а <B>во взрослой 25.</B>\n\n• На <b><I>детском мастер-классе</I></b> научимся готовить <i>классический</i> <b>итальянский десерт «Тирамису»</b> в домашних условиях. Рассмотрим технологию <b>приготовления крема</b> и <b>варианты сборки десерта.</b>\n\n• На <b><i>взрослом мастер-классе</i></b> научимся готовить <b><I>невероятно популярный сегодня</I> японский десерт «Моти».</b> Рассмотрим <b>особенности</b> приготовления <b>заварного рисового теста,</b> а также научимся <b>формовать «Моти».\n\n• Детские группы</b> будут проходить в <b>пятницу 29 марта в 15:00 и в 16:30, взрослая группа</b> приступит к мастер-классу <b>в 18:00</b>.\n\n<i>❗Далее следуйте моим указаниям для выбора времени <b>мастер-класса.</b></i>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "Отлично! 👍",
										callback_data: "firstMeeting2",
									},
								],
							],
						},
					}
				);
				break;
			case 2:
				dataAboutUser.userAction = "firstMeeting2";
				await bot.editMessageText(
					`<b><i>Этап 1/3  •  Выбор группы</i></b> ${
						dataAboutUser.selectedTimeGroup ? "✅" : ""
					}\n\nДавайте <b>определимся с группой!</b> 😉\n\n<b>Доступные группы сейчас:<blockquote>${
						timeGroups[0].listedUsers.length >=
							timeGroups[0].maxCountOfSeats && timeGroups[0].listedUsers
							? `<u>${timeGroups[0].time} - ${
									timeGroups[0].maxCountOfSeats -
									timeGroups[0].listedUsers.length
							  } / ${
									timeGroups[0].maxCountOfSeats - 1
							  } мест - детская</u>`
							: `${timeGroups[0].time} - ${
									timeGroups[0].maxCountOfSeats -
									timeGroups[0].listedUsers.length
							  } / ${timeGroups[0].maxCountOfSeats - 1} мест - детская`
					}\n${
						timeGroups[1].listedUsers.length >=
							timeGroups[1].maxCountOfSeats && timeGroups[1].listedUsers
							? `<u>${timeGroups[1].time} - ${
									timeGroups[1].maxCountOfSeats -
									timeGroups[1].listedUsers.length
							  } / ${
									timeGroups[1].maxCountOfSeats - 1
							  } мест - детская</u>`
							: `${timeGroups[1].time} - ${
									timeGroups[1].maxCountOfSeats -
									timeGroups[1].listedUsers.length
							  } / ${timeGroups[1].maxCountOfSeats - 1} мест - детская`
					}\n${
						timeGroups[2].listedUsers.length >=
							timeGroups[2].maxCountOfSeats && timeGroups[2].listedUsers
							? `<u>${timeGroups[2].time} - ${
									timeGroups[2].maxCountOfSeats -
									timeGroups[2].listedUsers.length
							  } / ${
									timeGroups[2].maxCountOfSeats - 1
							  } мест - взрослая</u>`
							: `${timeGroups[2].time} - ${
									timeGroups[2].maxCountOfSeats -
									timeGroups[2].listedUsers.length
							  } / ${timeGroups[2].maxCountOfSeats - 1} мест - взрослая`
					}</blockquote></b>\n${
						timeGroups[0].listedUsers.length >=
							timeGroups[0].maxCountOfSeats &&
						timeGroups[1].listedUsers.length >=
							timeGroups[1].maxCountOfSeats &&
						timeGroups[2].listedUsers.length >=
							timeGroups[2].maxCountOfSeats
							? "\n<b>К большому сожалению, все группы уже перепонены! Регистрация закрыта! ☹️</b>"
							: `${
									!dataAboutUser.selectedTimeGroup
										? `Выберите ниже <b>группу по времени!</b> 😀`
										: `\nВаша группа:\n<b>${
												dataAboutUser.selectedTimeGroup == "15:00"
													? "Детская"
													: `${
															dataAboutUser.selectedTimeGroup ==
															"16:30"
																? "Детская"
																: `${
																		dataAboutUser.selectedTimeGroup ==
																		"18:00"
																			? "Взрослая"
																			: ``
																  }`
													  }`
										  }, в ${
												dataAboutUser.selectedTimeGroup
										  } - 29 марта</b>\n\nВы можете выбрать <b>другую</b> группу! 😉`
							  }`
					}`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: `${
											timeGroups[0].listedUsers.length <
												timeGroups[0].maxCountOfSeats &&
											timeGroups[0].listedUsers
												? `${
														dataAboutUser.selectedTimeGroup ==
														"15:00"
															? `• ${
																	timeGroups[0].time
															  } - осталось ${
																	timeGroups[0]
																		.maxCountOfSeats -
																	timeGroups[0].listedUsers
																		.length -
																	1
															  } мест •`
															: `${
																	timeGroups[0].time
															  } - осталось ${
																	timeGroups[0]
																		.maxCountOfSeats -
																	timeGroups[0].listedUsers
																		.length
															  } мест`
												  }`
												: ""
										}`,
										callback_data: "selectGroup1500",
									},
								],
								[
									{
										text: `${
											timeGroups[1].listedUsers.length <
												timeGroups[1].maxCountOfSeats &&
											timeGroups[1].listedUsers
												? `${
														dataAboutUser.selectedTimeGroup ==
														"16:30"
															? `• ${
																	timeGroups[1].time
															  } - осталось ${
																	timeGroups[1]
																		.maxCountOfSeats -
																	timeGroups[1].listedUsers
																		.length -
																	1
															  } мест •`
															: `${
																	timeGroups[1].time
															  } - осталось ${
																	timeGroups[1]
																		.maxCountOfSeats -
																	timeGroups[1].listedUsers
																		.length
															  } мест`
												  }`
												: ""
										}`,
										callback_data: "selectGroup1630",
									},
								],
								[
									{
										text: `${
											timeGroups[2].listedUsers.length <
												timeGroups[2].maxCountOfSeats &&
											timeGroups[2].listedUsers
												? `${
														dataAboutUser.selectedTimeGroup ==
														"18:00"
															? `• ${
																	timeGroups[2].time
															  } - осталось ${
																	timeGroups[2]
																		.maxCountOfSeats -
																	timeGroups[2].listedUsers
																		.length -
																	1
															  } мест •`
															: `${
																	timeGroups[2].time
															  } - осталось ${
																	timeGroups[2]
																		.maxCountOfSeats -
																	timeGroups[2].listedUsers
																		.length
															  } мест`
												  }`
												: ""
										}`,
										callback_data: "selectGroup1800",
									},
								],
								// [
								// 	{
								// 		text: `${
								// 			!timeGroups[0].listedUsers.length <
								// 				timeGroups[0].maxCountOfSeats &&
								// 			!timeGroups[1].listedUsers.length <
								// 				timeGroups[1].maxCountOfSeats &&
								// 			!timeGroups[2].listedUsers.length <
								// 				timeGroups[2].maxCountOfSeats
								// 				? "Связаться с нами"
								// 				: ""
								// 		}`,
								// 		url: "",
								// 	},
								// ],
								[
									{
										text: `⬅️Назад`,
										callback_data: "firstMeeting1",
									},
									{
										text: `${
											dataAboutUser.selectedTimeGroup
												? "Выбрать✅"
												: ""
										}`,
										callback_data: "firstMeeting3",
									},
								],
							],
						},
					}
				);
				break;

			case 3:
				dataAboutUser.userAction = "firstMeeting3";
				try {
					bot.deleteMessage(chatId, dataAboutUser.otherMessageId);
				} catch (error) {}

				await bot.editMessageText(
					`<b><i>Этап 2/3  •  Полное ФИО</i></b> ${
						dataAboutUser.fullName == "" ? "" : "✅"
					}\n\nПриступим к <b>знакомству!</b> 👋😉\n\n${
						dataAboutUser.fullName == ""
							? "<b>Пример (ФИО)</b>:\n<code>Петров Пётр Петрович</code>\n\nНапишите ниже <b>своё полное ФИО!</b> 😀"
							: `<b>Указаное ФИО:</b>\n<code>${dataAboutUser.fullName}</code>\n\nНапишите <b>изменённые</b> данные! 🤔`
					}✍️`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: `${
											dataAboutUser.selectedTimeGroup
												? "⬅️Назад"
												: ""
										}`,
										callback_data: "firstMeeting2",
									},
									{
										text: `${
											dataAboutUser.fullName ? "Вперед➡️" : ""
										}`,
										callback_data: "firstMeeting4",
									},
								],
							],
						},
					}
				);
				break;
			case 4:
				dataAboutUser.userAction = "firstMeeting4";

				bot.editMessageText(
					`<b><i>Этап 3/3  •  Номер телефона</i></b> ${
						dataAboutUser.phoneNumber == "" ? "" : "✅"
					}\n\n<b>Отлично!</b>👌\nТеперь мы не <b><i>чужие люди!</i></b> 😁\n\n${
						dataAboutUser.phoneNumber == ""
							? "<b>Пример</b>:\n<code>+79333333333</code>\n\nСейчас укажите ваш <b>номер телефона!</b> 😊"
							: `<b>Вписанный номер:</b>\n<code>${dataAboutUser.phoneNumber}</code>\n\nВпишите <b>измененный</b> номер телефона! 🧐`
					}✍️`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: `${
											dataAboutUser.fullName ? "⬅️Назад" : ""
										}`,
										callback_data: "firstMeeting3",
									},
									{
										text: `${
											dataAboutUser.phoneNumber ? "Вперед➡️" : ""
										}`,
										callback_data: "firstMeeting5",
									},
								],
							],
						},
					}
				);

				await bot
					.sendMessage(
						chatId,
						`Используйте <b>удобное автозаполнение</b> контакта ⬇️`,
						{
							parse_mode: "HTML",
							disable_web_page_preview: true,
							reply_markup: {
								keyboard: [
									[
										{
											text: "Автозаполнить номер",
											request_contact: true,
											resize_keyboard: true,
										},
									],
								],
							},
						}
					)
					.then((message) => {
						dataAboutUser.otherMessageId = message.message_id;
					});

				break;
			case 5:
				try {
					bot.deleteMessage(chatId, dataAboutUser.otherMessageId);
				} catch (error) {}
				dataAboutUser.userAction = "-";
				await bot.editMessageText(
					`<b>❗ВНИМАНИЕ❗</b>\nПожалуйста, проверьте <i><b>корректность данных,</b></i> в дальнейшем, <b>у вас не будет возможности изменить параметры!\n\n• Группа:  <code>${
						dataAboutUser.selectedTimeGroup == "15:00"
							? "Детская"
							: `${
									dataAboutUser.selectedTimeGroup == "16:30"
										? "Детская"
										: `${
												dataAboutUser.selectedTimeGroup == "18:00"
													? "Взрослая"
													: ``
										  }`
							  }`
					}, в ${
						dataAboutUser.selectedTimeGroup
					}</code>\n• Ваше ФИО:  <code>${
						dataAboutUser.fullName
					}</code>\n• Телефон:  <code>${
						dataAboutUser.phoneNumber
					}</code>\n\nЕсть ошибки? ❌\nВернитесь</b> и <b>измените</b> данные!👌`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[
									{
										text: "⬅️Изменить",
										callback_data: "firstMeeting4",
									},
									{
										text: "Все верно✅",
										callback_data: "firstMeeting6",
									},
								],
							],
						},
					}
				);
				break;
			case 6:
				dataAboutUser.registrationIsOver = true;
				if (
					!timeGroups[0].listedUsers.find((obj) => obj == chatId) &&
					!timeGroups[1].listedUsers.find((obj) => obj == chatId) &&
					!timeGroups[2].listedUsers.find((obj) => obj == chatId) &&
					chatId != qu1z3xId &&
					chatId != stepanovId
				) {
					switch (dataAboutUser.selectedTimeGroup) {
						case "15:00":
							timeGroups[0].listedUsers.push(chatId.toString());
							break;
						case "16:30":
							timeGroups[1].listedUsers.push(chatId.toString());
							break;
						case "18:00":
							timeGroups[2].listedUsers.push(chatId.toString());
							break;
					}
				}

				try {
					dataAboutUser.userAction = "-";
					await bot.editMessageText(
						`<b>Прекрасно! Регистрация завершена! 👍</b>\n<b>Ждем вас в ${dataAboutUser.selectedTimeGroup} - 29 марта!</b>\n\n<i>• Не удаляйте пожалуйста наш с вами чат, я вовремя напомню вам о событии, расскажу как добраться до места, и после мероприятия спрошу с вас отзыв! 😊</i>`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: usersData.find((obj) => obj.chatId == chatId)
								.messageId,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text: "👤 Моя анкета 🪪",
											callback_data: "myForm",
										},
									],
									[
										{
											text: `${
												chatId == qu1z3xId || chatId == stepanovId
													? `💠Управление💠`
													: ""
											}`,
											callback_data: "adminMenu",
										},
									],
								],
							},
						}
					);
				} catch (error) {
					await bot.sendMessage(
						chatId,
						`<b>Прекрасно! Регистрация завершена! 👍</b>\n<b>Ждем вас в ${dataAboutUser.selectedTimeGroup} - 29 марта!</b>\n\n<i>• Не удаляйте пожалуйста наш с вами чат, я вовремя напомню вам о событии, расскажу как добраться до места, и после мероприятия спрошу с вас отзыв! 😊</i>`,
						{
							parse_mode: "HTML",
							disable_web_page_preview: true,
							disable_web_page_preview: true,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text: "👤 Моя анкета 🪪",
											callback_data: "myForm",
										},
									],
									[
										{
											text: `${
												chatId == qu1z3xId || chatId == stepanovId
													? `💠Управление💠`
													: ""
											}`,
											callback_data: "adminMenu",
										},
									],
								],
							},
						}
					);
					console.log(error);
					sendDataAboutError(chatId, `${String(error)}`);
				}

				if (TOKEN == TOKENs[1]) {
					set(dataRef, {
						culinarUsersData: usersData,
						masterClassFeedbacks: masterClassFeedbacks,
						timeGroups: timeGroups,
					});
				}
				console.log(timeGroups);
				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function myForm(chatId) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
	try {
		await bot.editMessageText(
			`<b><i>👤 Моя анкета 🪪</i>\n\n• Ваше ФИО:  <code>${
				dataAboutUser.fullName
			}</code>\n• Группа:  <code>${
				dataAboutUser.selectedTimeGroup == "15:00"
					? "Детская"
					: `${
							dataAboutUser.selectedTimeGroup == "16:30"
								? "Детская"
								: `${
										dataAboutUser.selectedTimeGroup == "18:00"
											? "Взрослая"
											: ``
								  }`
					  }`
			}, в ${dataAboutUser.selectedTimeGroup}</code>\n• Телефон:  <code>${
				dataAboutUser.phoneNumber
			}</code>\n\n${
				masterClassFeedbacks.find((obj) => obj.chatId == chatId)
					? "Спасибо за ваше мнение! 🙏"
					: "Не забудьте оставить отзыв по окончании события! 😊"
			}</b>`,
			{
				parse_mode: "html",
				chat_id: chatId,
				message_id: usersData.find((obj) => obj.chatId == chatId).messageId,
				disable_web_page_preview: true,
				reply_markup: {
					inline_keyboard: [
						[
							{ text: "⬅️Назад", callback_data: "firstMeeting6" },
							{ text: "Отзыв 📧", callback_data: "addFeedback" },
						],
					],
				},
			}
		);
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function addFeedback(chatId, numberOfStage = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		switch (numberOfStage) {
			case 1:
				dataAboutUser.userAction = "addFeedback1";
				await bot.editMessageText(
					`<b><i>✍️ Отзыв 📧</i>\n\nЕсть положительные впечатления от мероприятия? Передайте их нам! 😉\n\nНапишите, что вам понравилось! ✍️😆</b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[{ text: "⬅️Назад ", callback_data: "myForm" }],
							],
						},
					}
				);

				break;
			case 2:
				dataAboutUser.userAction = "addFeedback2";
				await bot.editMessageText(
					`<b><i>✍️ Отзыв 📧</i>\n\nМы учтем ваше сообщение! 😀\n\nСпасибо за обратную связь! 😉❤️</b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						disable_web_page_preview: true,
						reply_markup: {
							inline_keyboard: [
								[{ text: "⬅️Назад", callback_data: "myForm" }],
							],
						},
					}
				);
				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function adminMenu(chatId) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	if (chatId == qu1z3xId || chatId == stepanovId) {
		try {
			dataAboutUser.userAction = "-";

			await bot.editMessageText(
				`<i><b>💠Центр управления💠\n\n</b>❗Алерты рассылаются от ваших рук! 😉 </i>`,
				{
					parse_mode: "html",
					chat_id: chatId,
					message_id: usersData.find((obj) => obj.chatId == chatId)
						.messageId,
					disable_web_page_preview: true,
					reply_markup: {
						inline_keyboard: [
							[
								{
									text: "Алерты 📣",
									callback_data: "adminMenuSendMessage1",
								},
							],
							[
								{ text: "Реестр 💾", callback_data: "dataList1" },
								{ text: "Отзывы 📧", callback_data: "dataList2" },
							],
							[
								{
									text: "🪪 Регистрация 👤",
									callback_data: "firstMeeting1",
								},
							],
						],
					},
				}
			);
		} catch (error) {
			console.log(error);
			sendDataAboutError(chatId, `${String(error)}`);
		}
	}
}

async function dataLists(chatId, listNum = 1) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	let text = ["", "", ""];
	let a = 0,
		b = 0,
		c = 0;

	try {
		switch (listNum) {
			case 1:
				for (let i = 0; i < usersData.length; i++) {
					if (
						usersData[i].registrationIsOver &&
						usersData[i].selectedTimeGroup == "15:00"
					) {
						text[0] += `[${a + 1}] <code>${
							usersData[i].fullName
						}</code>\n• Телефон:  <code>${
							usersData[i].phoneNumber
						}</code>\n\n`;
						a++;
					} else if (
						usersData[i].registrationIsOver &&
						usersData[i].selectedTimeGroup == "16:30"
					) {
						text[1] += `[${b + 1}] <code>${
							usersData[i].fullName
						}</code>\n• Телефон:  <code>${
							usersData[i].phoneNumber
						}</code>\n\n`;
						b++;
					} else if (
						usersData[i].registrationIsOver &&
						usersData[i].selectedTimeGroup == "18:00"
					) {
						text[2] += `[${c + 1}] <code>${
							usersData[i].fullName
						}</code>\n• Телефон:  <code>${
							usersData[i].phoneNumber
						}</code>\n\n`;
						c++;
					}
				}

				bot.editMessageText(
					`<b><i>👨‍🍳 Участники 🥳</i>\n\n${
						a + b + c > 0
							? `Кликом копируется инфа❗\n\n<i>🔴 Детская в 15:00:\n\n${
									text[0] || "Нет записей\n\n"
							  }🔴 Детская в 16:30:\n\n${
									text[1] || "Нет записей\n\n"
							  }🔴 Взрослая в 18:00:\n\n${
									text[2] || "Нет записей\n\n"
							  }</i>Всего: ${a + b + c}`
							: "Пока что пусто 🏝️"
					}</b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId === chatId)
							.messageId,
						reply_markup: {
							inline_keyboard: [
								[
									{ text: "⬅️Назад", callback_data: "adminMenu" },
									{
										text: "Обновить🔄️",
										callback_data: "dataList1",
									},
								],
							],
						},
					}
				);
				break;
			case 2:
				for (let i = 0; i < masterClassFeedbacks.length; i++) {
					let user = usersData.find(
						(obj) => obj.chatId === masterClassFeedbacks[i].chatId
					);

					if (
						masterClassFeedbacks[i].text &&
						user.selectedTimeGroup == "15:00"
					) {
						text[0] += `[${a + 1}] <code>${
							user.fullName
						}</code>\n• <code>${user.phoneNumber}</code>\n"${
							masterClassFeedbacks[i].text
						}"\n\n`;
						a++;
					} else if (
						masterClassFeedbacks[i].text &&
						user.selectedTimeGroup == "16:30"
					) {
						text[1] += `[${b + 1}] <code>${
							user.fullName
						}</code>\n• <code>${user.phoneNumber}</code>\n"${
							masterClassFeedbacks[i].text
						}"\n\n`;
						b++;
					} else if (
						masterClassFeedbacks[i].text &&
						user.selectedTimeGroup == "18:00"
					) {
						text[2] += `[${c + 1}] <code>${
							user.fullName
						}</code>\n• <code>${user.phoneNumber}</code>\n"${
							masterClassFeedbacks[i].text
						}"\n\n`;
						c++;
					}
				}

				bot.editMessageText(
					`<b><i>👨‍🍳 Отзывы участников 📩 </i>\n\n${
						a + b + c > 0
							? `Кликом копируется инфа❗\n\n<i>🔴 Детская в 15:00:\n\n${
									text[0] || "Нет отзывов\n\n"
							  }🔴 Детская в 16:30:\n\n${
									text[1] || "Нет отзывов\n\n"
							  }🔴 Взрослая в 18:00:\n\n${
									text[2] || "Нет отзывов\n\n"
							  }</i>Всего: ${a + b + c}`
							: "Пока что пусто 🏝️"
					}</b>`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId === chatId)
							.messageId,
						reply_markup: {
							inline_keyboard: [
								[
									{ text: "⬅️Назад", callback_data: "adminMenu" },
									{
										text: "Обновить🔄️",
										callback_data: "dataList2",
									},
								],
							],
						},
					}
				);
				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function adminMenuSendMessage(chatId, numberOfStage) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	try {
		switch (numberOfStage) {
			case 1:
				dataAboutUser.userAction = "adminMenuSendMessage1";

				await bot.editMessageText(
					"<b><i>📋 Алерты 📣 \n\n❗ВНИМАНИЕ❗</i>\n\nВсе пользователи получат уведомление!\n\nНапишите объявление ниже! ✍️</b>",
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						reply_markup: {
							inline_keyboard: [
								[{ text: "⬅️Назад", callback_data: "adminMenu" }],
							],
						},
					}
				);
				break;
			case 2:
				dataAboutUser.userAction = "-";
				await bot.editMessageText(
					`<b><i>📋 Алерты 📣</i>\n\n</b>Объявление <b>успешно</b> опубликовано! 😉✅`,
					{
						parse_mode: "html",
						chat_id: chatId,
						message_id: usersData.find((obj) => obj.chatId == chatId)
							.messageId,
						reply_markup: {
							inline_keyboard: [
								[
									{ text: "⬅️Назад", callback_data: "adminMenu" },
									{
										text: "Создать еше ➕",
										callback_data: "adminMenuSendMessage1",
									},
								],
							],
						},
					}
				);
				for (let i = 0; i < usersData.length; i++) {
					if (usersData[i].chatId != stepanovId) {
						bot.sendMessage(
							usersData[i].chatId,
							`<b><i>Обьявление 📣</i>\n\n${textMessageForAllUsers}</b>`,
							{
								parse_mode: "html",
								reply_markup: {
									inline_keyboard: [
										[
											{
												text: "Удалить ❌",
												callback_data: "deleteexcess",
											},
											{
												text: "Спасибо 👍",
												callback_data: "deleteexcess",
											},
										],
									],
								},
							}
						);
					}
				}
				break;
		}
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function start(chatId, quickStart = false) {
	const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

	let textToSayHello = "";
	const dateNowHHNN = new Date().getHours() * 100 + new Date().getMinutes();
	if (dateNowHHNN < 1200 && dateNowHHNN >= 600) textToSayHello = "Доброе утро";
	else if (dateNowHHNN < 1700 && dateNowHHNN >= 1200)
		textToSayHello = "Добрый день";
	else if (dateNowHHNN < 2200 && dateNowHHNN >= 1700)
		textToSayHello = "Добрый вечер";
	else if (dateNowHHNN >= 2200 || dateNowHHNN < 600)
		textToSayHello = "Доброй ночи";

	try {
		await bot
			.sendMessage(
				chatId,
				`<b>${textToSayHello}, ${dataAboutUser.firstName}! 👋</b>`,
				{
					parse_mode: "HTML",
					disable_web_page_preview: true,
				}
			)
			.then((message) => {
				dataAboutUser.messageId = message.message_id;
			});

		await bot.sendMessage(chatId, `ㅤ`, {}).then((message) => {
			dataAboutUser.messageId = message.message_id;
		});

		if (!quickStart) firstMeeting(chatId);
		else if (quickStart) adminMenu(chatId);
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

async function StartAll() {
	if (TOKEN == TOKENs[0]) {
		BotName = "digsch27_bot";
	} else if (TOKEN == TOKENs[1]) {
		BotName = "sch27masterclass";

		get(dataRef).then((snapshot) => {
			if (snapshot.exists()) {
				const dataFromDB = snapshot.val();
				usersData = dataFromDB.culinarUsersData || [];
				masterClassFeedbacks = dataFromDB.masterClassFeedbacks || [];
				timeGroups = dataFromDB.timeGroups || [];
			}
		});
	}

	try {
		bot.on("contact", (message) => {
			const chatId = message.chat.id; // Сначала определяем chatId
			const dataAboutUser = usersData.find((obj) => obj.chatId == chatId); // Затем находим информацию о пользователе
			if (dataAboutUser && dataAboutUser.userAction == "firstMeeting4") {
				dataAboutUser.phoneNumber = message.contact.phone_number;
				firstMeeting(chatId, 5);
				console.log(333);
			}
		});

		bot.on("message", async (message) => {
			const chatId = message.chat.id;
			const text = message.text;
			let dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

			try {
				if (!dataAboutUser) {
					usersData.push({
						chatId: message.chat.id,
						messageId: "",
						otherMessageId: "",
						userName: message.from.username,
						firstName: message.from.first_name,
						userAction: "",
						selectedTimeGroup: "",
						fullName: "",
						phoneNumber: "",
						registrationIsOver: false,
					});
				}

				if (usersData.find((obj) => obj.chatId == chatId)) {
					dataAboutUser = usersData.find((obj) => obj.chatId == chatId);
					//? КОМАНДЫ
					switch (text) {
						case "/start":
						case "/restart":
							if (chatId == qu1z3xId || chatId == stepanovId) {
								start(chatId, true);
							} else {
								if (!dataAboutUser.registrationIsOver) {
									start(chatId);
								} else firstMeeting(chatId, 6);
							}
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;

						default:
							break;
					}
				}

				if (dataAboutUser && dataAboutUser.userAction == "addFeedback1") {
					masterClassFeedbacks.push({
						chatId: chatId,
						text: text,
					});
					addFeedback(chatId, 2);
				}

				if (
					(chatId == qu1z3xId || chatId == stepanovId) &&
					dataAboutUser &&
					dataAboutUser.userAction == "adminMenuSendMessage1"
				) {
					textMessageForAllUsers = text;
					await bot.editMessageText(
						`<b><i>📋 Алерты 📣</i>\n\n• Объявление выглядит так:<blockquote><i>Обьявление 📣</i>\n\n${textMessageForAllUsers}</blockquote></b>`,
						{
							parse_mode: "html",
							chat_id: chatId,
							message_id: usersData.find((obj) => obj.chatId == chatId)
								.messageId,
							reply_markup: {
								inline_keyboard: [
									[
										{
											text: "⬅️Назад",
											callback_data: "adminMenuSendMessage1",
										},
										{
											text: "Создать ✅",
											callback_data: "adminMenuSendMessage2",
										},
									],
								],
							},
						}
					);
				}
				if (
					dataAboutUser &&
					dataAboutUser.userAction == "firstMeeting3" &&
					text.match(/\s/g) &&
					!/\d/.test(text)
				) {
					dataAboutUser.fullName = text;
					firstMeeting(chatId, 4);
					console.log(1);
				}

				bot.deleteMessage(chatId, message.message_id);
			} catch (error) {
				console.log(error);
				sendDataAboutError(chatId, `${String(error)}`);
			}
		});

		//? ОБРАБОТЧИК КЛАВИАТУРЫ ПОД СООБЩЕНИЯМИ

		bot.on("callback_query", (query) => {
			const chatId = query.message.chat.id;
			const data = query.data;

			const dataAboutUser = usersData.find((obj) => obj.chatId == chatId);

			try {
				// if (!dataAboutUser) {
				// 	usersData.push({
				// 		chatId: message.chat.id,
				// 		messageId: "",
				// 		userName: message.from.username,
				// 		firstName: message.from.first_name,
				// 		userAction: "",
				// 		selectedTimeGroup: [],
				// 	});
				// }
				if (usersData.find((obj) => obj.chatId == chatId)) {
					if (data.includes("firstMeeting")) {
						let numberOfStage = data.match(/^firstMeeting(\d+)$/);
						numberOfStage = parseInt(numberOfStage[1]);

						firstMeeting(chatId, numberOfStage);
					}

					if (data.includes("dataList")) {
						let listNum = data.match(/^dataList(\d+)$/);
						listNum = parseInt(listNum[1]);

						dataLists(chatId, listNum);
					}

					if (data.includes("adminMenuSendMessage")) {
						let numberOfStage = data.match(/^adminMenuSendMessage(\d+)$/);
						numberOfStage = parseInt(numberOfStage[1]);

						adminMenuSendMessage(chatId, numberOfStage);
					}

					if (data.includes("selectGroup")) {
						let numberOfGroup = data.match(/^selectGroup(\d+)$/);
						numberOfGroup = parseInt(numberOfGroup[1]);
						if (dataAboutUser.userAction == "firstMeeting2") {
							switch (numberOfGroup) {
								case 1500:
									dataAboutUser.selectedTimeGroup = "15:00";
									break;
								case 1630:
									dataAboutUser.selectedTimeGroup = "16:30";
									break;
								case 1800:
									dataAboutUser.selectedTimeGroup = "18:00";
									break;
							}
							firstMeeting(chatId, 2);
						}
					}

					//? КОМАНДЫ
					switch (data) {
						case "":
							break;
						case "myForm":
							myForm(chatId);
							break;
						case "adminMenu":
							adminMenu(chatId);
							break;
						case "deleteexcess":
							try {
								bot.deleteMessage(chatId, query.message.message_id);
							} catch (error) {
								console.log(error);
								sendDataAboutError(chatId, `${String(error)}`);
							}
							break;
						case "addFeedback":
							addFeedback(chatId);
							break;
						case "":
							break;
						case "":
							break;
						case "":
							break;

						default:
							break;
					}
				}
			} catch (error) {
				console.log(error);
				sendDataAboutError(chatId, `${String(error)}`);
			}
		});
	} catch (error) {
		console.log(error);
		sendDataAboutError(chatId, `${String(error)}`);
	}
}

StartAll();
