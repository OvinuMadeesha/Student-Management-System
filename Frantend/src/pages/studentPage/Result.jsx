import React, { useEffect, useState } from 'react';
import '../../assets/styles/Result.css';
import axios from 'axios';

const Result = ({ onClose }) => {
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            const studentId = localStorage.getItem('studentId'); // stored during login
            const token = localStorage.getItem('token');

            if (!studentId || !token) {
                setError('Student not authenticated');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/results/${studentId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                // Extract and map only module name and grade
                const formattedResults = response.data.map((res) => ({
                    module: res.module.moduleName,
                    grade: res.grade
                }));

                setResults(formattedResults);
            } catch (err) {
                console.error(err);
                setError('Failed to load results');
            }
        };

        fetchResults();
    }, []);

    return (
        <div className="result-overlay">
            <div className="result-popup">
                <button className="close-button" onClick={onClose}>×</button>
                <h2>Your Results</h2>

                {error ? (
                    <p className="error">{error}</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Module</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((res, index) => (
                                <tr key={index}>
                                    <td>{res.module}</td>
                                    <td>{res.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Result;
