import styled from 'styled-components';

export const Container = styled.div`
    height: 64px;
    background: #fff;
    padding: 0 30px;
`;

export const Content = styled.div`
    height: 64px;
    max=width: 900px;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    nav {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;

        a {
            font-weight: bold;
            color: #2161ac;
        }
    }
`;
