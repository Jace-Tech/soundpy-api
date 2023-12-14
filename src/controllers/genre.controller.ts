import { Response } from "express"
import { RequestAlt } from "../types/common"
import { BadRequestError } from "../utils/customError"
import Genres from "../models/Genres"
import { response } from "../utils/response"


// HANDLE CREATE GENRE
export const handleAddGenre = async (req: RequestAlt, res: Response) => {
    if (!req.body.name) throw new BadRequestError("Name is required!")

    // CHECK IF CONTENT EXISTS
    const exists = await Genres.findOne({ name: req.body.name })
    if (exists) throw new BadRequestError("Genre already exist")

    // ADD GENRE
    const genre = await Genres.create({ name: req.body.name })
    res.status(201).send(response("Genre created!", genre))
}


// HANDLE UPDATE GENRE
export const handleUpdateGenre = async (req: RequestAlt, res: Response) => {
    if (!req.body.name) throw new BadRequestError("Name is required!")
    if (!req.params.id) throw new BadRequestError("Id is required!")

    // CHECK IF CONTENT EXISTS
    const exists = await Genres.findOne({ _id: req.params.id })
    if (!exists) throw new BadRequestError("Genre does not exist")

    // ADD GENRE
    const genre = await Genres.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
    res.status(201).send(response("Genre updated!", genre))
}


// HANDLE DELETE GENRE
export const handleDeleteGenre = async (req: RequestAlt, res: Response) => {
    if (!req.params.id) throw new BadRequestError("Id is required!")

    // CHECK IF CONTENT EXISTS
    const exists = await Genres.findOne({ _id: req.params.id })
    if (!exists) throw new BadRequestError("Genre does not exist")

    // ADD GENRE
    const genre = await Genres.findByIdAndDelete(req.params.id, { name: req.body.name })
    res.status(201).send(response("Genre delete!", genre))
}


// HANDLE GET ALL GENRE
export const handleGetAllGenres = async (req: RequestAlt, res: Response) => {
    const genres = await Genres.find()
    res.status(201).send(response("All genres!", genres))
}