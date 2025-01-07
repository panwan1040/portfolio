type Props = {
    children: React.ReactNode;
    title?: string;
};

export const FeedWrapper = ({
    children,
    title
}: Props) => {
    return (
        <div className="flex-1 relative top-0 pb-10">
            <h1 className="text-left">
            { title }
            </h1>
            {children}
        </div>
    )
}