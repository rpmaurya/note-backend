const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');
const multer = require('multer');

//router -1 get all notes using get method required login
router.get("/fetchnote", fetchuser, async (req, res) => {
    try {

        const note = await Note.find({ user: req.user.id });
        res.send(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error is occer");
    }

})





//router-2 create notes using post method  required login
router.post("/createnote", fetchuser, [
    body('title', 'Enter the title name').isLength({ min: 3 }),
    body('description', 'Enter the correct password').isLength({ min: 5 })
], async (req, res) => {

    try {
        const { title, subject, description } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, subject, description, userId: req.user.id, token: req.user.token
        })
        const savenote = await note.save();
        res.send(savenote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("some error is occer");
    }
})


//router-3  update notes using put method ,login required

router.put("/updatenotes/:id", fetchuser, async (req, res) => {
    try {


        const { title, subject, description } = req.body;

        //create new notes
        const newnote = {};
        if (title) { newnote.title = title };
        if (subject) { newnote.subject = subject };
        if (description) { newnote.description = description };

        //find the note be updated and update it

        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("page not found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        };

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newnote }, { new: true })
        res.send(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server internal error");
    }
})


//router-4 delete note  using by delete method , login are required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
    try {

        //find the note be deleted and delete it

        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("page not found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed");
        };

        note = await Note.findByIdAndDelete(req.params.id);
        res.send({ "success": "note is deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server internal error");
    }
})


router.get("/searchnote", fetchuser, async (req, res) => {
    const userId = req.user.id;
    const searchnote = req.query.searchnote;
    try {
        let note;
        let noteobj = {
            // userId: userId,
            $or: [
                { title: { $regex: searchnote } },
                { subject: { $regex: searchnote } }
            ]
        }
        note = await Note.find(noteobj)
        if (!note.length > 0) { return res.status(404).send("notes are not found") };

        res.send(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server internal error");
    }
})

//router:- 6 upload file using post method ,login are required
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads")
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + "-" + Date.now() + ".jpg")
        }
    })
}).single("user_file");

router.post("/uploadfile", fetchuser, upload, async (req, res) => {
    res.send("file uploaded");
})

//vikask@shilshtech.com

module.exports = router;