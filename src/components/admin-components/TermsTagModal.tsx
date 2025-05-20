import React, { useState } from 'react';
import ModalLayout from '../common/CommonModalLayout';
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';
import '../../app/TagsInput.css'
import CommonAIButton from '../common/CommonAIButton';

export interface TermsTagModalProps {
    onClose: () => void;
    onSave: (keywords: string[]) => void;
    loading?: boolean;
    maxTags?: number;
    placeholder?: string;
    validationRegex?: RegExp;
}

const TermsTagModal: React.FC<TermsTagModalProps> = ({
    onClose,
    onSave,
    maxTags = 10,
    placeholder = 'Add a tag',
    validationRegex = /^[a-zA-Z0-9\-_]+$/,
    loading
}) => {
    const [tags, setTags] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (newTags: string[]) => {
        if (maxTags && newTags.length > maxTags) {
            setError(`Maximum ${maxTags} tags allowed`);
            return;
        }

        const invalidTags = newTags.filter(tag => !validationRegex.test(tag));
        if (invalidTags.length > 0) {
            setError(`Invalid tags: ${invalidTags.join(', ')}`);
            return;
        }

        setError(null);
        setTags(newTags);
    };

    const handleSave = () => {
        if (!error) {
            onSave(tags);
        }
    };

    return (
        <ModalLayout
            onClose={onClose}
            modalTitle="Select Keywords"
        >
            <div className="pt-6 space-y-4">
                <div className="custom-tags-input-container">
                    <TagsInput
                        value={tags}
                        onChange={handleChange}
                        onlyUnique
                        maxTags={maxTags}
                        inputProps={{
                            placeholder,
                            className: 'custom-tags-input',
                            'aria-label': 'Add keywords'
                        }}
                        tagProps={{
                            className: 'react-tagsinput-tag',
                            classNameRemove: 'react-tagsinput-remove'
                        }}
                    />
                </div>
                <div className="text-sm text-gray-500">
                    <p>Press Enter to add a tag. {maxTags && `Maximum ${maxTags} tags allowed.`}</p>
                    <p>Allowed characters: alphanumeric, dash (-), and underscore (_).</p>
                </div>
            </div>

            <div className="flex justify-between items-center w-full my-6">
                {error && (
                    <span className="text-red-500 text-sm">{error}</span>
                )}
                <div className="flex space-x-2 ml-auto">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <CommonAIButton
                        handleButtonClick={handleSave}
                        isDisabled={!!error || !!loading}
                        isSubmitting={loading}
                    />

                </div>
            </div>
        </ModalLayout>
    );
};

export default TermsTagModal;