export default function Question(props: { title: string, content: string }) {
    return (
        <div className="question-container">
            <h1>{ props.title }</h1>

            <p>{ props.content }</p>
        </div>
    );
}
