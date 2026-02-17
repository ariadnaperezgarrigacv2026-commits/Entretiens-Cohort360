interface Props {
    name: string;
    onClick?: () => void;
}

export default function UpdateButton({ name, onClick }: Props) {
    return (
        <button
            className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded"
            onClick={onClick}
        >
            {name}
        </button>
    );
}