"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewController = void 0;
const review_1 = require("./../models/review");
const express_validator_1 = require("express-validator");
class ReviewController {
    constructor() {
        this.OnGetReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield review_1.Review.findAll();
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'get data success.',
                reviews: finding
            });
        });
        this.OnUpdateReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield review_1.Review.findOne({ where: { id: req.body.review_id } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'review was not found.'
                });
            }
            try {
                finding.display = req.body.display;
                finding.save();
                return res.status(200).json({
                    status: true,
                    message: 'ok',
                    description: 'review was updated.'
                });
            }
            catch (error) {
                return res.status(500).json({
                    status: false,
                    message: 'error',
                    description: 'something went wrong.'
                });
            }
        });
        this.OnChangeStatusReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    status: false,
                    message: 'error',
                    errorMessage: errors.array()
                });
            }
            const finding = yield review_1.Review.update({
                display: req.body.display
            }, {
                where: { id: req.body.id }
            });
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'update review success.'
            });
        });
        this.OnDeleteReview = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const finding = yield review_1.Review.findOne({ where: { id: req.params.id } });
            if (!finding) {
                return res.status(404).json({
                    status: false,
                    message: 'error',
                    description: 'review was not found.'
                });
            }
            finding.destroy();
            return res.status(200).json({
                status: true,
                message: 'ok',
                description: 'review was deleted.'
            });
        });
    }
}
exports.ReviewController = ReviewController;
