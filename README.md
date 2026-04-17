# Alzheimer's-SD

## Overview

This is an Alzheimer's disease diagnosis application that leverages artificial neural networks (ANNs) to analyze metabolic changes in patients. The app uses predictive modeling to calibrate variations in biomarkers such as tau protein and amyloid levels, aiding in early detection and monitoring of Alzheimer's disease.

## Features

- **Metabolic Analysis**: Processes patient metabolic data to identify patterns associated with Alzheimer's disease.
- **ANN Prediction**: Utilizes advanced neural network models for accurate prediction of disease progression.
- **Biomarker Calibration**: Calibrates tau and amyloid variations based on metabolic inputs.
- **Diagnosis Support**: Provides diagnostic insights to support medical professionals.

## Getting Started

### Prerequisites

- Python 3.8+
- Required libraries (see requirements.txt)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/momoh23/Alzheimer-s-SD.git
   cd Alzheimer-s-SD
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Training the Model

1. Place your metabolic dataset in the `data/` directory (e.g., `metabolic_data.csv`).
2. Run the training script:
   ```bash
   python src/train_model.py
   ```

### Running the Application

1. Start the Flask app:
   ```bash
   python src/app.py
   ```

2. Access the app at `http://localhost:5000`

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Lead app: Dr Mohamed Kentour
Co-lead: SWYFT/NHS


