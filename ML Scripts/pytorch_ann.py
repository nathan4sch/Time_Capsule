from typing import Tuple

import matplotlib.pyplot as plt
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.onnx
from matplotlib.figure import Figure
import pickle


class PyTorchANN(nn.Module):
    def __init__(self,
                    input_size: int,
                    hidden_size: int,
                    output_size: int,
                    random_seed: int = 42) -> None:
        super(PyTorchANN, self).__init__()
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size
        self.seed = random_seed
        torch.manual_seed(random_seed)

        self.model = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Dropout(.2),
            nn.Linear(hidden_size, output_size)
        )

    def forward(self, X: torch.Tensor) -> torch.Tensor:
        output = self.model(X)
        return output

    def train(self,
                X_train: torch.Tensor,
                y_train: torch.Tensor,
                # X_val: torch.Tensor,
                # y_val: torch.Tensor,
                epochs: int,
                batch_size: int,
                learning_rate: float) -> None:
        
        # Define the loss function and optimizer
        loss_function = nn.CrossEntropyLoss()
        optimizer = torch.optim.SGD(params=self.model.parameters(), lr=learning_rate, weight_decay=0.001)

        train_losses = []
        train_accs = []

        val_losses = []
        val_accs = []

        for epoch in range(epochs):
            # Prepare the batches for training
            for X_batch, y_batch in zip(X_train.split(batch_size),
                                        y_train.split(batch_size)):
                # Set the model to train mode
                self.model.train()

                # Zero the gradients for this iteration
                optimizer.zero_grad()

                # Forward pass through the network
                output = self.forward(X_batch)
                
                # Calculate the loss
                loss = loss_function(output, y_batch)
                
                # Backpropagation
                loss.backward()

                # Update the parameters
                optimizer.step()

            # Set the model to eval mode
            self.model.eval()
            # Use torch.no_grad() to prevent tracking history (and using memory)
            # since backpropagation is not needed for validation
        #     with torch.no_grad():
        #         train_losses.append(loss_function(self.forward(X_train), y_train).item())
        #         train_accs.append(self.accuracy(X_train, y_train))

        #         val_losses.append(loss_function(self.forward(X_val), y_val).item())
        #         val_accs.append(self.accuracy(X_val, y_val))

        #     # Print the loss and accuracy for every 50th epoch
        #     print(f"[{epoch+1:} / {epochs}] | Train Loss: {train_losses[-1]:.5f} | Train Accuracy: {train_accs[-1]:.5f} | Val Loss: {val_losses[-1]:.5f} | Val Accuracy: {val_accs[-1]:.5f}")
            
        # self.train_val_metrics = {
        #     "train_losses": train_losses,
        #     "train_accs": train_accs,
        #     "val_losses": val_losses,
        #     "val_accs": val_accs
        # }
    
    def predict(self, X: torch.Tensor) -> torch.Tensor:
        # Set the model to eval mode and use torch.no_grad()
        self.model.eval()
        with torch.no_grad():
            # predict the class labels
            labels = torch.argmax(self.forward(X), dim=1)
            return labels

    def plot_train_val_metrics(self) -> Tuple[Figure, np.ndarray]:

        fig, ax = plt.subplots(1, 2, figsize=(12, 6))

        # Plot the training and validation losses
        ax[0].plot(self.train_val_metrics["train_losses"], label="Train Loss")
        ax[0].plot(self.train_val_metrics["val_losses"], label="Val Loss")

        ax[0].set_xlabel("Epoch")
        ax[0].set_ylabel("Loss")
        ax[0].legend()

        # Plot the training and validation accuracies
        ax[1].plot(self.train_val_metrics["train_accs"], label="Train Accuracy")
        ax[1].plot(self.train_val_metrics["val_accs"], label="Val Accuracy")

        ax[1].set_xlabel("Epoch")
        ax[1].set_ylabel("Accuracy")
        ax[1].legend()

        fig.suptitle("Train/Val Metrics")
        fig.tight_layout()

        plt.savefig("pytorch_ann_train_val_metrics.png")

        return fig, ax

    def accuracy(self, X: torch.Tensor, y: torch.Tensor) -> float:
        assert X.shape[0] == y.shape[0], f"X.shape[0] != y.shape[0] ({X.shape[0]} != {y.shape[0]})"
        correct = torch.sum(self.predict(X) == y.argmax(dim=1))
        return (correct / X.shape[0]).item()

if __name__ == "__main__":
    from sklearn.model_selection import train_test_split

    if torch.cuda.is_available():
        device = torch.device("cuda")
    else:
        device = torch.device("cpu")
        print("GPU not available. Using CPU instead.")

    print(f"Using device: {device}\n")

    with open('X_train.pkl', 'rb') as file:
        X = np.array(pickle.load(file))

    with open('y_train.pkl', 'rb') as file:
        y = np.array(pickle.load(file))

    y = torch.tensor(y).long()

    # Split X and y into training (80%) and remaining (20%)
    # X_train, X_remaining, y_train, y_remaining = train_test_split(X, y, test_size=0.1, random_state=23)

    # # Split the remaining data into validation (50%) and test (50%)
    # X_val, X_test, y_val, y_test = train_test_split(X_remaining, y_remaining, test_size=0.5, random_state=56)
    
    # # Flatten the images
    X_train = torch.tensor(X).float().to(device)
    # X_val = torch.tensor(X_val).float().to(device)
    # X_test = torch.tensor(X_test).float().to(device)

    # # One-hot encode the labels
    y_train = F.one_hot(y).float().to(device)
    # y_val = F.one_hot(y_val).float().to(device)
    # y_test = F.one_hot(y_test).float().to(device)

    # Train the neural network
    pytorch_ann = PyTorchANN(input_size=19985, output_size=2, hidden_size=256, random_seed=39).to(device)
    pytorch_ann.train(
        X_train=X_train,
        y_train=y_train,
        # X_val=X_val,
        # y_val=y_val,
        epochs=100,
        batch_size=128,
        learning_rate=0.01
    )
    pytorch_ann.model.eval()

    torch.onnx.export(pytorch_ann.model, X_train[0], 'model.onnx', export_params=True, do_constant_folding=True, verbose=True)
    # test_accuracy = pytorch_ann.accuracy(X_test, y_test)

    # print(test_accuracy)

    # pytorch_ann.plot_train_val_metrics()
