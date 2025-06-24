import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Import the GIF from your assets folder
import amorGif from "./assets/amor.gif";

function App() {
	const [showButton, setShowButton] = useState(false);
	const [showHeartsInitialBurst, setShowHeartsInitialBurst] = useState(false); // Estado para a explosão inicial de corações
	const [showModal, setShowModal] = useState(false);
	const [modalContent, setModalContent] = useState("Muito obrigado por ser essa pessoa tão maravilhosa e perfeita, te amo muito. Aceita continuar namorando comigo?");
	// O estado showModalButtons não será mais necessário para esconder os botões,
	// mas o mantemos para consistência se houver outras lógicas que dependam dele.
	const [showModalButtons, setShowModalButtons] = useState(true);
	const [isContinuousHearts, setIsContinuousHearts] = useState(false); // Novo estado para controlar a chuva contínua de corações
	const [fallingHearts, setFallingHearts] = useState([]); // Estado para guardar os corações individuais para a chuva

	// Ref para gerar IDs únicos para os corações e evitar problemas de chave no React
	const heartIdCounter = useRef(0);

	useEffect(() => {
		// Timer para mostrar o botão "Clique Aqui!" após 48 segundos
		const buttonTimer = setTimeout(() => {
			setShowButton(true);
		}, 5000);

		return () => clearTimeout(buttonTimer);
	}, []);

	// Efeito para a explosão inicial de corações (dura 5 segundos)
	useEffect(() => {
		if (showHeartsInitialBurst) {
			const heartsBurstTimer = setTimeout(() => {
				setShowHeartsInitialBurst(false);
			}, 5000); // Esconde a explosão inicial de corações após 5 segundos
			return () => clearTimeout(heartsBurstTimer);
		}
	}, [showHeartsInitialBurst]);

	// Efeito para a chuva contínua de corações após a resposta na modal
	useEffect(() => {
		let interval;
		if (isContinuousHearts) {
			interval = setInterval(() => {
				heartIdCounter.current += 1;
				const newHeart = {
					id: heartIdCounter.current, // ID único para o coração
					left: `${Math.random() * 100}vw`, // Posição horizontal aleatória
					animationDuration: `${Math.random() * 2 + 3}s`, // Duração da animação entre 3 e 5 segundos
					opacity: Math.random(), // Opacidade aleatória
					fontSize: `${Math.random() * 2 + 1}rem`, // Tamanho de fonte aleatório entre 1rem e 3rem
				};
				setFallingHearts((prevHearts) => [...prevHearts, newHeart]);

				// Remove o coração da lista após a sua animação terminar
				// Isso é importante para a performance, evitando que o array cresça indefinidamente
				const durationMs = parseFloat(newHeart.animationDuration.replace("s", "")) * 1000;
				setTimeout(() => {
					setFallingHearts((prevHearts) => prevHearts.filter((heart) => heart.id !== newHeart.id));
				}, durationMs + 500); // Adiciona um pequeno buffer após a duração da animação
			}, 200); // Adiciona um novo coração a cada 200ms para criar o efeito de chuva
		}

		return () => clearInterval(interval); // Limpa o intervalo quando o componente é desmontado ou a chuva contínua é desativada
	}, [isContinuousHearts]);

	const handleButtonClick = () => {
		setShowHeartsInitialBurst(true); // Inicia a explosão inicial de corações
		// Delay para a modal aparecer depois dos corações começarem a cair
		setTimeout(() => {
			setShowModal(true);
			// Resetar o conteúdo da modal e mostrar botões caso ela tenha sido usada antes
			setModalContent("Muito obrigado por ser essa pessoa tão maravilhosa e perfeita, te amo muito. Aceita continuar namorando comigo?");
			// Mantemos showModalButtons como true para que os botões sempre apareçam
			setShowModalButtons(true);
		}, 1000);
	};

	const handleAnswerClick = (answer) => {
		let messageToDisplay = "";
		if (answer === "sim") {
			messageToDisplay = "Ainda bem! ❤️ 🙏";
		} else if (answer === "nao") {
			messageToDisplay = "Não existe essa opção! 😉";
		}

		setModalContent(messageToDisplay);
		setTimeout(() => {
			setIsContinuousHearts(true);
		}, 2000);
		setTimeout(() => {
			setShowModal(false);
		}, 4000);
	};

	return (
		<div className="container">
			<h1>Feliz Dois anos de namoro</h1>
			<img src={amorGif} alt="GIF de Amor" className="main-gif" />

			{showButton && (
				<button className="click-button" onClick={handleButtonClick}>
					Clique Aqui!
				</button>
			)}

			{/* Renderiza os corações da explosão inicial */}
			{showHeartsInitialBurst && (
				<>
					{[...Array(50)].map((_, i) => (
						<div
							key={`initial-heart-${i}`} // Chave única para os corações da explosão inicial
							className="heart"
							style={{
								left: `${Math.random() * 100}vw`,
								animationDuration: `${Math.random() * 2 + 3}s`,
								opacity: Math.random(),
								fontSize: `${Math.random() * 2 + 1}rem`,
							}}
						>
							❤️
						</div>
					))}
				</>
			)}

			{/* Renderiza os corações que caem continuamente (efeito de chuva) */}
			{fallingHearts.map((heart) => (
				<div
					key={heart.id}
					className="heart"
					style={{
						left: heart.left,
						animationDuration: heart.animationDuration,
						opacity: heart.opacity,
						fontSize: heart.fontSize,
					}}
				>
					❤️
				</div>
			))}

			{showModal && (
				<div className="modal-overlay">
					<div className="modal-content">
						{/* A classe "final-modal-message" ainda será aplicada para estilizar a mensagem final */}
						<p className={modalContent !== "Muito obrigado por ser essa pessoa tão maravilhosa e perfeita, te amo muito. Aceita continuar namorando comigo?" ? "final-modal-message" : ""}>
							{modalContent}
						</p>{" "}
						{/* Os botões agora são renderizados incondicionalmente dentro da modal */}
						<div className="modal-buttons">
							<button onClick={() => handleAnswerClick("sim")}>Sim</button>
							<button onClick={() => handleAnswerClick("nao")}>Não</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default App;
