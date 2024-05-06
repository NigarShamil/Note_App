import React, { useState } from 'react'
import TagInput from '../../components/input/TagInput'
import { MdClose, MdEditNote } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {

    const [title, setTitle] = useState(noteData?.title || '');
    const [content, setContent] = useState(noteData?.content || '');
    const [tags, setTags] = useState(noteData?.tags || []);

    const [error, setError] = useState(null)

    // Add Note
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post("/add-note", {
                title,
                content,
                tags,
            });

            if (response.data && response.data.note) {
                showToastMessage("Note Added Successfully")
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message)
            }
        }
    };

    // Edit Note
    const editNote = async () => {
        const noteId = noteData._id
        try {
            const response = await axiosInstance.put("/edit-note/" + noteId, {
                title,
                content,
                tags,
            });

            if (response.data && response.data.note) {
                showToastMessage("Note Updated Successfully")
                getAllNotes()
                onClose()
            }
        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message)
            }
        }
    }

    const handleAddNote = () => {
        if (!title) {
            setError('Please enter the title!');
            return;
        }
        if (!content) {
            setError('Please enter the content!');
            return;
        }
        setError('');

        if (type === 'edit') {
            editNote()
        } else {
            addNewNote()
        }
    }

    return (
        <div className='relative'>
            <button className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50' onClick={onClose}>
                <MdClose className='text-xl text-slate-400' />
            </button>


            <div className='flex flex-col gap-2'>
                <label className='input-label'>TITLE</label>
                <input
                    type="text"
                    className='text-lg text-slate-950 outline-none'
                    placeholder='Do Your Daily Workout At PM 9'
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                />
            </div>
            <div className='flex flex-col gap-2 mt-4'>
                <label className='input-label'>CONTENT</label>
                <textarea
                    rows={10}
                    type='text'
                    className='text-sm text-slate-950 outline-none p-2 bg-slate-50 rounded'
                    placeholder='Content...'
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                />
            </div>
            <div className='mt-3'>
                <label className='input-label'>TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && <p className='text-xs text-red-500 pt-4'>{error}</p>}
            <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>{type === "edit" ? "UPDATE" : "ADD"}</button>
        </div>
    )
}

export default AddEditNotes